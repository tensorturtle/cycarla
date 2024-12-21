import asyncio

from flask_socketio import SocketIO
from bleak import BleakClient

from pycycling.sterzo import Sterzo
from pycycling.cycling_power_service import CyclingPowerService
from pycycling.fitness_machine_service import FitnessMachineService

class LiveControlState:
    def __init__(self):
        self.steer = 0
        self.watts = 0
        self.cadence = 0
        self.throttle = 0
        self.brake = 0
        self.wheel_speed = 0

    def update_steer(self, steer):
        '''
        Convert degrees (from BLE) to normalized (-1, 1) (for CARLA)

        STERZO has a range of ~60 degrees, so we divide by 30 to get a normalized value.
        '''
        self.steer = steer / 150 # empirically determined.

    def update_throttle(self, watts):
        '''
        Convert watts (from BLE) to normalized (0, 1) (for CARLA)
        '''
        self.watts = watts
        self.throttle = watts / 100 # empirically determined
    
    def update_speed(self, speed):
        '''
        No conversion; speed is km/h throughout.
        '''
        self.wheel_speed = speed
    
    def update_cadence(self, cadence):
        '''
        No conversion; cadence is RPM throughout.
        '''
        self.cadence = cadence

    # Brake is not implemented

class PycyclingInput:
    def __init__(self, sterzo_device, powermeter_device, socketio, on_steering_update, on_power_update, on_speed_update, on_cadence_update):
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
        self.on_speed_update = on_speed_update
        self.on_cadence_update = on_cadence_update

        self.ftms = None
        self.ftms_max_resistance = None
        self.ftms_desired_resistance = 0

    async def run_all(self):
        loop = asyncio.get_running_loop()
        # loop.create_task(self.connect_to_powermeter())
        loop.create_task(self.connect_to_sterzo())
        loop.create_task(self.connect_to_fitness_machine())
        await asyncio.sleep(1e10) # run forever

    
    async def connect_to_sterzo(self):
        async with BleakClient(self.sterzo_device) as client:
            def steering_handler(steering_angle):
                #print(f"Steering angle: {steering_angle}")
                self.on_steering_update(steering_angle)
                self.socketio.emit('steering_angle', steering_angle)
                self.socketio.emit('sterzo_device', self.sterzo_device.name)

            await client.is_connected()
            sterzo = Sterzo(client)
            sterzo.set_steering_measurement_callback(steering_handler)
            await sterzo.enable_steering_measurement_notifications()
            await asyncio.sleep(1e10) # run forever
    
    # async def connect_to_powermeter(self):
    #     async with BleakClient(self.powermeter_device) as client:
    #         def power_handler(power):
    #             #print(f"Power: {power.instantaneous_power}")
    #             self.on_power_update(power.instantaneous_power)
    #             self.socketio.emit('power', power.instantaneous_power)
    #             self.socketio.emit('power_device', self.powermeter_device.name)
            
    #         await client.is_connected()
    #         powermeter = CyclingPowerService(client)
    #         powermeter.set_cycling_power_measurement_handler(power_handler)
    #         await powermeter.enable_cycling_power_measurement_notifications()
    #         await asyncio.sleep(1e10) # run forever
    
    async def connect_to_fitness_machine(self):
        async with BleakClient(self.powermeter_device, timeout=20) as client: 
            # long timeout is required. Somehow FTMS takes longer to setup.
            await client.is_connected()

            self.ftms = FitnessMachineService(client)
            print("Connected to FTMS")

            res_levels = await self.ftms.get_supported_resistance_level_range()
            print(f"Resistance level range: {res_levels}")
            self.ftms_max_resistance = res_levels.maximum_resistance

            def print_control_point_response(message):
                pass
                # print("Received control point response:")
                # print(message)
                # print()
            self.ftms.set_control_point_response_handler(print_control_point_response)

            
            def print_indoor_bike_data(data):
                # print("Received indoor bike data:")
                # print(data)
                power = data.instant_power
                self.on_power_update(power)
                self.socketio.emit('power', power)

                speed = data.instant_speed
                self.on_speed_update(speed)
                self.socketio.emit('wheel_speed', speed)

                cadence = data.instant_cadence
                self.on_cadence_update(cadence)
                self.socketio.emit('cadence', cadence)

                self.socketio.emit('power_device', self.powermeter_device.name)
            self.ftms.set_indoor_bike_data_handler(print_indoor_bike_data)
            await self.ftms.enable_indoor_bike_data_notify()

            supported_features = await self.ftms.get_fitness_machine_feature()

            if not supported_features.resistance_level_supported:
                print("WARNING: Resistance level not supported on this smart trainer.")
                return

            if not supported_features.resistance_level_supported:
                print("WARNING: Resistance level not supported on this smart trainer.")
                return
            


            await self.ftms.enable_control_point_indicate()
            await self.ftms.request_control()
            await self.ftms.reset()

            while True:
                if self.ftms_desired_resistance > self.ftms_max_resistance:
                    print("Warning: Desired resistance is greater than max resistance. Setting to max resistance.")
                    self.ftms_desired_resistance = self.ftms_max_resistance
                #print(f"Setting resistance to {self.ftms_desired_resistance}")
                await self.ftms.set_target_resistance_level(self.ftms_desired_resistance)
                await asyncio.sleep(1)