from textual.app import App, ComposeResult
from textual.containers import Container
from textual.widgets import Header, Footer, Button, Static
from textual.reactive import reactive
from textual.screen import Screen
from textual import log

import asyncio

# mock stuff mainly
import time
from time import monotonic
import random

import psutil

import platform
PLATFORM = platform.system()

import os
os.environ['PYGAME_HIDE_SUPPORT_PROMPT'] = "hide" # hide pygame welcome message
import threading
import multiprocessing
import subprocess

from manual_control import game_loop

# bluetooth utilities
from mock_bleak import connect_to_device, scan_bt, threaded_scan, scan_bt_async_runner, BT_DEVICES, LATEST_STEERING_ANGLE, LATEST_SPEED, STERZO_THROTTLE

import globals
globals.globals_init()

PROCS = [] # multiprocessing processes
THREADS = []

PAIR_HISTORY = [] # We store the addresses of bluetooth devices that have previously been paired to this computer in a file. If the program exits gracefully (pressing 'e' for exit), bluetooth devices will be unpaired and removed, so this functionality is redundant. If the program is force exited (CTRL-C, for example), the bluetooth devices will remain paired to this machine, preventing it from pairing anew. In that case, we read from the saved file and unpair the devices before scanning for new ones. 

# App state flags
SCANNING_STAGE = True # True means: we are searching (including restarting bluetooth). False means: stop searching. Pair and stream data from devices.

# Interface to bleak

live_clients = {}
from enum import Enum
class PycyclingService(Enum):
    SPEED = "00001816-0000-1000-8000-00805f9b34fb"
    STERZO = "347b0001-7635-408b-8918-8ff3949ce592"

class FindControllerScreen(Screen):
    def compose(self) -> ComposeResult:
        yield Header()
        yield Container(
            AvailableDevices(),
            BTService(PycyclingService.STERZO),
            BTService(PycyclingService.SPEED),
        )

        yield Button("Pair all", id="pair_all")
        yield Footer()

    def action_pair_all(self) -> None:
        global PAIR_HISTORY
        global BT_DEVICES
        global SCANNING_STAGE
        global PROCS

        SCANNING_STAGE = False
        PAIR_HISTORY = []
        with open(".appdata/bt_history.temp", "r") as f:
            for line in f:
                PAIR_HISTORY.append(line.strip())

        for d in BT_DEVICES:
            if d.address not in PAIR_HISTORY:
                PAIR_HISTORY.append(d.address)
            p_new = multiprocessing.Process(target=asyncio.run, args=(connect_to_device(d),))
            PROCS.append(p_new)

        for p in PROCS:
            p.start()


        # save PAIR_HISTORY to file
        with open(".appdata/bt_history.temp", "w") as f:
            for d in PAIR_HISTORY:
                f.write(f"{d}\n")

        self.app.pop_screen()

    def on_button_pressed(self, event: Button.Pressed) -> None:
        if event.button.id == "pair_all":
            self.action_pair_all()

class BTConnectionStatus(Static):
    '''
    A widget that shows the status of a bluetooth service
    '''
    def __init__(self, service_type: PycyclingService):
        super().__init__()
        self.service_type = service_type

    connection_status = reactive("DISCONNECTED")

    def on_mount(self) -> None:
        self.set_interval(1/20, self.update_connection_status)

    def update_connection_status(self) -> None:
        self.connection_status = mock_connection_status(self.service_type)
        self.update(self.service_type.name)

    def watch_connection_status(self, time: float) -> None:
        '''
        The 'watch' keyword means that this function will be called
        when the 'time' property changes
        '''
        if self.connection_status == "CONNECTING":
            self.remove_class("connected")
            self.add_class("enabled")
        elif self.connection_status == "CONNECTED":
            self.remove_class("enabled")
            self.add_class("connected")
        elif self.connection_status == "DISCONNECTED":
            self.remove_class("connected")
            self.remove_class("enabled")

    def attempt_connect(self) -> None:
        self.connection_status = "CONNECTING"

    def disconnect(self) -> None:
        self.connection_status = "DISCONNECTED"

def mock_connection_status(service: PycyclingService) -> str:
    global BT_DEVICES
    for bt_device in BT_DEVICES:
        if service.value in bt_device.metadata["uuids"]:
            return "CONNECTED"
    return "DISCONNECTED"


class BTService(Static):
    '''
    A bluetooth connection widget for one type of device
    '''
    def __init__(self, service_type: PycyclingService):
        super().__init__()
        self.service_type = service_type

    def on_button_pressed(self, event: Button.Pressed) -> None:
        '''
        Handle button presses
        '''
        button_id = event.button.id
        status_display = self.query_one(BTConnectionStatus)
        if event.button.id == "bt_enable":
            self.add_class("enabled")
            status_display.attempt_connect()
        elif event.button.id == "bt_disable":
            self.remove_class("enabled")
            self.remove_class("connected")
            status_display.disconnect()
    def compose(self) -> ComposeResult:
        '''
        Create child widgets for this widget
        '''
        yield Button("Enable", id="bt_enable", variant="success")
        yield Button("Disable", id="bt_disable", variant="error")
        yield Button("Choose Next", id="bt_next")
        yield BTConnectionStatus(self.service_type)


class AvailableDevices(Static):

    def on_mount(self) -> None:
        global PROCS
        for pr in PROCS:
            pr.kill()
        PROCS = []
        self.set_interval(1/10, self.update_devices)

    def update_devices(self) -> None:
        global SCANNING_STAGE
        global BT_DEVICES
        self.update(f"Available Devices {BT_DEVICES}.\nSearching status: {SCANNING_STAGE}")

class StreamingSensor(Static):

    def on_mount(self) -> None:
        self.set_interval(1/20, self.update_sensor)

    def update_sensor(self) -> None:
        global PROCS

        self.update(f"Speed: {LATEST_SPEED.value} m/s, Steering Angle: {LATEST_STEERING_ANGLE.value}, normalize: {STERZO_THROTTLE.value} degrees. Processes: {PROCS}")


class CycarlaApp(App):
    '''
    TUI for CyCARLA

    Connects to hardware via Bluetooth & other protocols,
    and sends processed outputs to CARLA client app via Websockets.
    Also provides a Terminal-based User Interface to see connection status.
    '''
    CSS_PATH = "css/stylesheet.css"
    SCREENS = {
        "find_controller": FindControllerScreen,
    }
    BINDINGS = [
        ("e", "exit", "Exit Application"),
        ("f", "push_screen_find_controller", "Find Controller"),
        ]

    def on_mount(self) -> None:
        # push find_controller screen
        self.push_screen("find_controller")

    def compose(self) -> ComposeResult:
        '''
        Create child widgets for the app
        '''
        yield Header()
        yield Container(
            #AvailableDevices(),
            StreamingSensor(),
            #BTService(PycyclingService.STERZO),
            #BTService(PycyclingService.SPEED)
            )
        yield Footer()

    def action_push_screen_find_controller(self) -> None:
        '''
        Push the find_controller screen
        '''
        # Reset bluetooth connections
        global BT_DEVICES
        global SCANNING_STAGE
        global PROCS
        BT_DEVICES = []
        SCANNING_STAGE = True
        for pr in PROCS:
            pr.kill()
        PROCS = []
        self.push_screen("find_controller")

    def action_exit(self) -> None:
        '''
        Final app cleanup

        The default 'quit' action in the textual framework does not clean up after multiprocessing child processes, so this replaces it.
        '''
        global PROCS
        globals.CARLA_WINDOW=False

        for device in BT_DEVICES:
            subprocess.call(["bluetoothctl", "remove", device.address], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


        for pr in PROCS:
            pr.kill()
        PROCS = []

        self.exit()

def restart_system_bluetooth():
    if PLATFORM == "Linux":
        subprocess.call(["bluetoothctl", "power", "off"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        subprocess.call(["bluetoothctl", "power", "on"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def repeat_threaded_scan():
    global BT_DEVICES
    global SCANNING_STAGE
    global PAIR_HISTORY
    while True:
        if SCANNING_STAGE:
            for id in PAIR_HISTORY:
                if PLATFORM == "Linux":
                    subprocess.call(["bluetoothctl", "remove", id], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL) # run without printing to console
            BT_DEVICES = asyncio.run(scan_bt_async_runner())
        time.sleep(0.1) # sleep for a little bit to prevent tight loop when condition is false

def threaded_carla_main(args):
    while True:
        try:
            #print("Starting CARLA client...")
            game_loop(args)
        except RuntimeError as e:
            # For unknown reasons the traffic manager has a binding error
            # Which is solved by 'pkill -9 python'
            # see: https://github.com/carla-simulator/scenario_runner/issues/722
            #print("RuntimeError: ", e)
            #print("Attempting to kill all python processes and restart CARLA client...")
            os.system("pkill -9 python")
            time.sleep(2)
            continue
        except KeyboardInterrupt:
            print("KeyboardInterrupt from carla")
            break

if __name__ == "__main__":
    print("Starting CyCARLA...")
    import argparse
    argparser = argparse.ArgumentParser(
        description='CARLA Manual Control Client')
    argparser.add_argument(
        '-v', '--verbose',
        action='store_true',
        dest='debug',
        help='print debug information')
    argparser.add_argument(
        '--host',
        metavar='H',
        default='127.0.0.1',
        help='IP of the host server (default: 127.0.0.1)')
    argparser.add_argument(
        '-p', '--port',
        metavar='P',
        default=2000,
        type=int,
        help='TCP port to listen to (default: 2000)')
    argparser.add_argument(
        '-a', '--autopilot',
        action='store_true',
        help='enable autopilot')
    argparser.add_argument(
        '--res',
        metavar='WIDTHxHEIGHT',
        default='1280x720',
        help='window resolution (default: 1280x720)')
    argparser.add_argument(
        '--filter',
        metavar='PATTERN',
        default='vehicle.*',
        help='actor filter (default: "vehicle.*")')
    argparser.add_argument(
        '--generation',
        metavar='G',
        default='2',
        help='restrict to certain actor generation (values: "1","2","All" - default: "2")')
    argparser.add_argument(
        '--rolename',
        metavar='NAME',
        default='hero',
        help='actor role name (default: "hero")')
    argparser.add_argument(
        '--gamma',
        default=2.2,
        type=float,
        help='Gamma correction of the camera (default: 2.2)')
    argparser.add_argument(
        '--sync',
        action='store_true',
        help='Activate synchronous mode execution')
    args = argparser.parse_args()

    args.width, args.height = [int(x) for x in args.res.split('x')]


    if os.path.exists(".appdata/bt_history.temp"):
        with open(".appdata/bt_history.temp", "r") as f:
            for line in f:
                PAIR_HISTORY.append(line.strip())

    t_scanner = threading.Thread(target=repeat_threaded_scan, daemon=True)
    THREADS.append(t_scanner)

    p_carla = threading.Thread(target=threaded_carla_main, args=(args,), daemon=True)
    THREADS.append(p_carla)

    for t in THREADS:
        t.start()


    app = CycarlaApp()
    app.run()

    # clean up child processes
    p_children = psutil.Process(os.getpid()).children(recursive=True)
    for p in p_children:
        p.kill()
