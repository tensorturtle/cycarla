import asyncio 
import base64
from argparse import Namespace

import cv2
from flask import Flask
# from flask_cors import CORS
from flask_socketio import SocketIO
from bleak.backends.device import BLEDevice

from ble_utils import scan_bt_async_runner
from carla_control import *
from pycycling_input import PycyclingInput, LiveControlState

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

class GameState():
    def __init__(self):
        self.game_launched = False
    
    def set_game_launched(self, game_launched):
        self.game_launched = game_launched

game_state = GameState()

FIRST_GAME_LOOP = True

live_control_state = LiveControlState()

def game_loop(args, game_state: GameState):
    global FIRST_GAME_LOOP
    pygame.init()
    pygame.font.init()
    world = None
    original_settings = None

    frame_counter = 0

    try:
        client = carla.Client(args.host, args.port)
        client.set_timeout(1000.0)

        sim_world = client.get_world()

        if FIRST_GAME_LOOP:
            # set map
            client.load_world('Town07')
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

        while True:
            if not game_state.game_launched:
                socketio.emit('game_finished', 'true')
                break

            if args.sync:
                sim_world.tick()
            clock.tick_busy_loop(59)
            # if controller.parse_events(client, world, clock, args.sync):
            #     return
            controller.update_player_control(
                live_control_state.steer,
                live_control_state.throttle,
                live_control_state.brake,
            )
            world.tick(clock)
            world.render(display)
            pygame.display.flip()

            screen_surface = pygame.display.get_surface()
            screen_buffer = pygame.surfarray.array3d(screen_surface)
            screen_buffer = np.transpose(screen_buffer, (1, 0, 2))

            screen_buffer = cv2.cvtColor(screen_buffer, cv2.COLOR_RGB2BGR)
            _, buffer = cv2.imencode('.jpg', screen_buffer)
            jpg_as_text = base64.b64encode(buffer).decode()
            socketio.emit('carla_frame', jpg_as_text)

            frame_counter += 1


    finally:

        if original_settings:
            sim_world.apply_settings(original_settings)

        if (world and world.recording_enabled):
            client.stop_recorder()

        if world is not None:
            world.destroy()

        pygame.quit()



@socketio.on('bt_scan')
def handle_bt_scan():
    cycling_ble_devices = asyncio.run(scan_bt_async_runner())



    if len(cycling_ble_devices['sterzos']) > 0 and len(cycling_ble_devices['smart_trainers']) > 0:

        pycycling_input = PycyclingInput(
            # TODO: What if there are multiple devices for each category?
            cycling_ble_devices['sterzos'][0],
            cycling_ble_devices['smart_trainers'][0],
            socketio=socketio,
            on_steering_update=live_control_state.update_steer,
            on_power_update=live_control_state.update_throttle,
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

def start_game_loop():
    args = Namespace(
    debug=False,
    host='127.0.0.1',
    port=2000,
    autopilot=False,
    res='1280x720', # defines the maximum size of image shown in frontend
    filter='vehicle.diamondback.century',
    generation='2',
    rolename='hero',
    gamma=2.2,
    sync=False
    )
    args.width, args.height = [int(x) for x in args.res.split('x')]

    print("Starting game loop")
    game_loop(args, game_state)


if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)