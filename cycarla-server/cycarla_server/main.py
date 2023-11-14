import asyncio 
from flask import Flask, jsonify
# from flask_cors import CORS
from flask_socketio import SocketIO
from bleak import BleakClient
from bleak.backends.device import BLEDevice

from pycycling.sterzo import Sterzo
from pycycling.cycling_power_service import CyclingPowerService

from ble_utils import scan_bt_async_runner, serialize_bledevice

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

NUM_CLIENTS = 0

COUNTER = 0

class PycyclingInput:
    def __init__(self, sterzo_device, powermeter_device):
        self.sterzo_device = sterzo_device
        self.powermeter_device = powermeter_device

    async def run_all(self):
        loop = asyncio.get_running_loop()
        loop.create_task(self.connect_to_powermeter())
        loop.create_task(self.connect_to_sterzo())
        await asyncio.sleep(1e10) # run forever

    
    async def connect_to_sterzo(self):
        async with BleakClient(self.sterzo_device) as client:
            def steering_handler(steering_angle):
                print(f"Steering angle: {steering_angle}")
                socketio.emit('steering_angle', steering_angle)

            await client.is_connected()
            sterzo = Sterzo(client)
            sterzo.set_steering_measurement_callback(steering_handler)
            await sterzo.enable_steering_measurement_notifications()
            await asyncio.sleep(1e10) # run forever
    
    async def connect_to_powermeter(self):
        async with BleakClient(self.powermeter_device) as client:
            def power_handler(power):
                print(f"Power: {power.instantaneous_power}")
                socketio.emit('power', power.instantaneous_power)
            
            await client.is_connected()
            powermeter = CyclingPowerService(client)
            powermeter.set_cycling_power_measurement_handler(power_handler)
            await powermeter.enable_cycling_power_measurement_notifications()
            await asyncio.sleep(1e10) # run forever

@socketio.on('bt_scan')
def handle_bt_scan():
    cycling_ble_devices = asyncio.run(scan_bt_async_runner())

    if len(cycling_ble_devices['sterzos']) > 0 and len(cycling_ble_devices['smart_trainers']) > 0:
        assert isinstance(cycling_ble_devices['sterzos'][0], BLEDevice)
        pycycling_input = PycyclingInput(
            # TODO: What if there are multiple devices for each category?
            cycling_ble_devices['sterzos'][0],
            cycling_ble_devices['smart_trainers'][0],
        )

        asyncio.run(pycycling_input.run_all())
    

@socketio.on('connect')
def handle_connect():
    global NUM_CLIENTS
    NUM_CLIENTS += 1
    print('Client connected')

    socketio.start_background_task(send_heartbeat)

def send_heartbeat():
    global COUNTER
    global NUM_CLIENTS
    if NUM_CLIENTS == 1:
        while True:
            # print('Sending heartbeat')
            # print("Number of clients: " + str(NUM_CLIENTS))

            socketio.emit('heartbeat', COUNTER)
            socketio.sleep(1)

@socketio.on('disconnect')
def handle_disconnect():
    global NUM_CLIENTS
    NUM_CLIENTS -= 1
    print('Client disconnected')

@socketio.on('message')
def handle_message(message):
    print('Received message: ' + message)

if __name__ == '__main__':
    socketio.run(app, debug=True, host='127.0.0.1', port=5000)