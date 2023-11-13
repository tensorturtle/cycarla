import asyncio

from flask import Flask, jsonify
# from flask_cors import CORS
from flask_socketio import SocketIO
from bleak import BleakClient

from pycycling.sterzo import Sterzo

from ble_utils import scan_bt_async_runner

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

NUM_CLIENTS = 0

COUNTER = 0

async def run_sterzo(address):
    async with BleakClient(address) as client:
        def steering_handler(steering_angle):
            print(f"Steering angle: {steering_angle}")
            socketio.emit('steering_angle', steering_angle)

        await client.is_connected()
        sterzo = Sterzo(client)
        sterzo.set_steering_measurement_callback(steering_handler)
        await sterzo.enable_steering_measurement_notifications()
        await asyncio.sleep(1e10) # run forever

def run_sterzo_async(address):
    asyncio.run(run_sterzo(address))

@socketio.on('bt_scan')
def handle_bt_scan():
    bt_devices = asyncio.run(scan_bt_async_runner())
    print(bt_devices)
    socketio.emit('bt_devices', bt_devices)

    if len(bt_devices['sterzos']) > 0:
        print('Connecting to Sterzo')
        run_sterzo_async(bt_devices['sterzos'][0]['address'])

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