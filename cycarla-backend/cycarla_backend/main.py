import time
import asyncio
import base64
from argparse import Namespace

import cv2
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO

from cycarla_backend.ble_utils import scan_bt_async_runner
from cycarla_backend.carla_control import *
from cycarla_backend.pycycling_input import PycyclingInput, LiveControlState
from cycarla_backend.gpx import GPXCreator

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

gpx_creator = GPXCreator()

class GameState():
    def __init__(self):
        self.game_launched = False
        self.autopilot = False
        self.change_camera = False

    def set_game_launched(self, game_launched):
        self.game_launched = game_launched

    def set_autopilot(self, on):
        self.autopilot = on
        socketio.emit('autopilot_actual', on)

game_state = GameState()

FIRST_GAME_LOOP = True

live_control_state = LiveControlState()

pycycling_input = None

def game_loop(args, game_state: GameState):
    global FIRST_GAME_LOOP
    pygame.init()
    pygame.font.init()
    world = None
    original_settings = None

    frame_counter = 0

    gpx_creator = GPXCreator()
    gpx_creator.set_metadata_time(f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}")
    gpx_creator.set_track_info("Test GPS Activity", "VirtualRide")

    try:
        client = carla.Client(args.host, args.port)
        client.set_timeout(1000.0)

        sim_world = client.get_world()

        if FIRST_GAME_LOOP:
            # set map
            client.load_world('Town01')
            FIRST_GAME_LOOP = False
        if args.sync:
            original_settings = sim_world.get_settings()
            settings = sim_world.get_settings()
            if not settings.synchronous_mode:
                settings.synchronous_mode = True
                settings.fixed_delta_seconds = -1.05
            sim_world.apply_settings(settings)

            traffic_manager = client.get_trafficmanager()
            traffic_manager.set_synchronous_mode(True)

        if args.autopilot and not sim_world.get_settings().synchronous_mode:
            print("WARNING: You are currently in asynchronous mode and could "
                  "experience some issues with the traffic simulation")

        display = pygame.display.set_mode(
            (args.width, args.height),
            pygame.HWSURFACE | pygame.DOUBLEBUF)
        pygame.display.flip()

        reporter = Reporter(args.width, args.height, socketio)
        world = World(sim_world, reporter, args)

        controller = ControlCarlaWithCyclingBLE(world) # replaces KeyboardControl(world) in demo code

        if args.sync:
            sim_world.tick()
        else:
            sim_world.wait_for_tick()

        clock = pygame.time.Clock()

        # Send game start message
        socketio.emit('game_launched', 'true')

        if game_state.autopilot:
            world.player.set_autopilot(False)
            world.restart()
            world.player.set_autopilot(True)

        # get all traffic lights and turn them green forever
        traffic_lights = client.get_world().get_actors().filter('traffic.traffic_light')
        for tl in traffic_lights:
            tl.freeze(True)
            tl.set_state(carla.TrafficLightState.Green)

        prior_autopilot = game_state.autopilot

        # frame-by-frame simulation loop
        i = 0
        while True:
            i += 1
            if not game_state.game_launched:
                socketio.emit('game_finished', 'true')
                break

            if args.sync:
                sim_world.tick()

            clock.tick_busy_loop(59)

            if game_state.autopilot != prior_autopilot:
                # switching between manual and autopilot
                if game_state.autopilot:
                    world.player.set_autopilot(True)
                else:
                    world.player.set_autopilot(False)
                prior_autopilot = game_state.autopilot

            if not game_state.autopilot:
                controller.update_player_control(
                    live_control_state.steer,
                    live_control_state.throttle,
                    live_control_state.brake,
                    reporter.simulation_live_data.speed, # pass in current speed from simulator to modulate steering sensitivity
                    live_control_state.wheel_speed,
                    reporter.simulation_live_data.road_gradient # pass in gradient to simulate downhill speed
                )

            if game_state.change_camera:
                world.camera_manager.toggle_camera()
                game_state.change_camera = False


            world.tick(clock)
            world.render(display)
            pygame.display.flip()


            # Send game screen as image over socketio to frontend
            # 1280x720 is typically around 10MB/s
            screen_surface = pygame.display.get_surface()
            screen_buffer = pygame.surfarray.array3d(screen_surface)
            screen_buffer = np.transpose(screen_buffer, (1, 0, 2))
            screen_buffer = cv2.cvtColor(screen_buffer, cv2.COLOR_RGB2BGR)
            _, buffer = cv2.imencode('.jpg', screen_buffer)
            jpg_as_text = base64.b64encode(buffer).decode()
            socketio.emit('carla_frame', jpg_as_text)

            frame_counter += 1

            if pycycling_input is not None:
                # resistance is 0-200
                # max resistance is reached at 15 percent road gradient
                # resistance is linearly interpolated between 0 and 15 percent road gradient
                # cutoff at 15 percent road gradient
                # if negative road gradient, resistance is 0

                gradient = reporter.simulation_live_data.road_gradient

                if gradient < 0:
                    gradient = 0
                elif gradient > 15:
                    gradient = 15

                pycycling_input.ftms_desired_resistance = gradient * 200 / 15


            if i % 15 == 0: # don't create a GPX point for every frame, it messes up strava
                # North-south offsets change the distance travelled, so stick to places close to the equator.
                gnss_offset = (-0.849541, -91.104870) # Galapagos islands

                gpx_creator.add_trackpoint(
                    reporter.simulation_live_data.gnss[0] + gnss_offset[0],
                    reporter.simulation_live_data.gnss[1] + gnss_offset[1],
                    reporter.simulation_live_data.altitude,
                    f"{time.strftime('%Y-%m-%dT%H:%M:%S', time.gmtime())}.{int(time.time() * 1000 % 1000)}Z", # we need millisecond precision because there are multiple trackpoints per second. Using seconds causes speed calculation problems in Strava.
                    live_control_state.watts or None, # uses OR short-circuiting
                    live_control_state.cadence or None,
                )

    finally:
        gpx_creator.save_to_file(f"simulated_gpx_{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}.gpx")
        if original_settings:
            sim_world.apply_settings(original_settings)

        if (world and world.recording_enabled):
            client.stop_recorder()

        if world is not None:
            world.destroy()

        pygame.quit()

        print("Exited Carla simulation")



@socketio.on('bt_scan')
def handle_bt_scan():
    global pycycling_input
    cycling_ble_devices = asyncio.run(scan_bt_async_runner())

    if len(cycling_ble_devices['sterzos']) > 0 and len(cycling_ble_devices['smart_trainers']) > 0:

        pycycling_input = PycyclingInput(
            # TODO: What if there are multiple devices for each category?
            cycling_ble_devices['sterzos'][0],
            cycling_ble_devices['smart_trainers'][0],
            socketio=socketio,
            on_steering_update=live_control_state.update_steer,
            on_power_update=live_control_state.update_throttle,
            on_speed_update=live_control_state.update_speed,
            on_cadence_update=live_control_state.update_cadence
        )

        asyncio.run(pycycling_input.run_all())


@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('message')
def handle_message(message):
    print('Received message: ' + message)

@socketio.on('start_game')
def handle_start_game():
    socketio.start_background_task(start_game_loop)
    game_state.set_game_launched(True)


@socketio.on('finish_game')
def handle_finish_game():
    game_state.set_game_launched(False)

@socketio.on('autopilot')
def handle_autopilot():
    game_state.set_autopilot(not game_state.autopilot)

@socketio.on('change_camera')
def handle_change_camera():
    game_state.change_camera = True


def start_game_loop():

    args = Namespace(
    debug=False,
    host="127.0.0.1",
    port=2000,
    #host=str(os.environ['CARLA_SIM_IP']),
    #port=int(os.environ['CARLA_SIM_PORT']),
    autopilot=True,
    res='1280x720', # defines the maximum size of image shown in frontend
    filter='vehicle.diamondback.century',
    generation='2',
    rolename='hero',
    gamma=2.2,
    sync=True,
    )
    args.width, args.height = [int(x) for x in args.res.split('x')]

    print(f"Connecting to Carla simulation at {args.host}:{args.port}")
    game_loop(args, game_state)

def main():
    socketio.run(app, debug=True, host='0.0.0.0', port=9000)

if __name__ == '__main__':
    main()
