from flask import Flask, jsonify
# from flask_cors import CORS
from flask_socketio import SocketIO
import datetime

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

NUM_CLIENTS = 0

COUNTER = 0

@app.route('/api/bluetooth-devices', methods=['GET'])
def get_bluetooth_devices():
    nearby_devices = bluetooth.discover_devices(lookup_names=True)
    return jsonify(nearby_devices)

@socketio.on('connect')
def handle_connect():
    global NUM_CLIENTS
    NUM_CLIENTS += 1
    print('Client connected')

    socketio.start_background_task(send_heartbeat)

def send_heartbeat():
    while True:
        global COUNTER
        global NUM_CLIENTS
        COUNTER += 1
        print('Sending heartbeat')
        print("Number of clients: " + str(NUM_CLIENTS))

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