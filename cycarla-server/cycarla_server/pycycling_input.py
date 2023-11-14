import asyncio

from flask_socketio import SocketIO
from bleak import BleakClient

from pycycling.sterzo import Sterzo
from pycycling.cycling_power_service import CyclingPowerService

class LiveControlState:
    def __init__(self):
        self.steer = 0
        self.throttle = 0
        self.brake = 0

    def update_steer(self, steer):
        '''
        Convert degrees (from BLE) to normalized (-1, 1) (for CARLA)

        STERZO has a range of ~60 degrees, so we divide by 30 to get a normalized value.
        '''
        self.steer = steer / 30 / 5 # empirically determined. Divide by 2 for less sensitivity

    def update_throttle(self, throttle):
        '''
        Convert watts (from BLE) to normalized (0, 1) (for CARLA)
        '''
        self.throttle = throttle / 100 # empirically determined

    # Brake is not implemented

class PycyclingInput:
    def __init__(self, sterzo_device, powermeter_device, socketio, on_steering_update, on_power_update):
        '''
        sterzo_device: BLEDevice
        powermeter_device: BLEDevice
        socketio: SocketIO (from flask_socketio)
        on_steering_update: callback function (used to send steering angle to carla client)
        on_power_update: callback function (used to send power to carla client)
        '''
        self.sterzo_device = sterzo_device
        self.powermeter_device = powermeter_device
        self.socketio = socketio
        self.on_steering_update = on_steering_update
        self.on_power_update = on_power_update

    async def run_all(self):
        loop = asyncio.get_running_loop()
        loop.create_task(self.connect_to_powermeter())
        loop.create_task(self.connect_to_sterzo())
        await asyncio.sleep(1e10) # run forever

    
    async def connect_to_sterzo(self):
        async with BleakClient(self.sterzo_device) as client:
            def steering_handler(steering_angle):
                print(f"Steering angle: {steering_angle}")
                self.on_steering_update(steering_angle)
                self.socketio.emit('steering_angle', steering_angle)

            await client.is_connected()
            sterzo = Sterzo(client)
            sterzo.set_steering_measurement_callback(steering_handler)
            await sterzo.enable_steering_measurement_notifications()
            await asyncio.sleep(1e10) # run forever
    
    async def connect_to_powermeter(self):
        async with BleakClient(self.powermeter_device) as client:
            def power_handler(power):
                print(f"Power: {power.instantaneous_power}")
                self.on_power_update(power.instantaneous_power)
                self.socketio.emit('power', power.instantaneous_power)
            
            await client.is_connected()
            powermeter = CyclingPowerService(client)
            powermeter.set_cycling_power_measurement_handler(power_handler)
            await powermeter.enable_cycling_power_measurement_notifications()
            await asyncio.sleep(1e10) # run forever