# demonstrate using bleak to establish connections to devices
# but delay the actual data transfer until some user action
# to bypass the difficulty of stopping bleak connections separately
import time
from typing import List
from threading import Thread

import os
import subprocess

import asyncio

from bleak import BleakScanner, BleakClient
from bleak.backends.device import BLEDevice
from bleak.exc import BleakDBusError

from pycycling.sterzo import Sterzo
from pycycling.cycling_speed_cadence_service import CyclingSpeedCadenceService

STERZO_SERVICE = "347b0001-7635-408b-8918-8ff3949ce592"
SPEED_CADENCE_SERVICE = "00001816-0000-1000-8000-00805f9b34fb"

BT_DEVICES = []

async def connect_to_device(d: BLEDevice):
    # sometimes, the bluetooth device loses connection
    # between the time it is discovered and the time
    # we try to connect to it. In this case, we just
    # try again. That's what the while True and try except is for.
    while True:
        try:
            async with BleakClient(d, timeout=5.0) as client:
                if STERZO_SERVICE in d.metadata["uuids"]:
                    print("Sterzo connected")

                    sterzo = Sterzo(client)

                    def steering_handler(steering_angle):
                        print(steering_angle)

                    sterzo.set_steering_measurement_callback(steering_handler)
                    await sterzo.enable_steering_measurement_notifications()
                    await asyncio.sleep(100000)
                    await sterzo.disable_steering_measurement_notifications()
                elif SPEED_CADENCE_SERVICE in d.metadata["uuids"]:
                    print("Speed cadence connected")

                    trainer = CyclingSpeedCadenceService(client)

                    def my_page_handler(data):
                        print(data)
                    trainer.set_csc_measurement_handler(my_page_handler)
                    await trainer.enable_csc_measurement_notifications()
                    await asyncio.sleep(10000000)
                    await trainer.disable_csc_measurement_notifications()
                else:
                    print("Unknown device connected")
        except (asyncio.exceptions.CancelledError, asyncio.exceptions.TimeoutError, BleakDBusError):
            continue
    
def filter_cycling_accessories(devices: List[BLEDevice]) -> List[BLEDevice]:
    '''
    Given a list of BLE devices (as returned by BleakScanner.discover),
    organize them by the services they provide.
    '''

    relevant_devices = []

    for d in devices:
        if STERZO_SERVICE in d.metadata["uuids"]:
            relevant_devices.append(d)
        if SPEED_CADENCE_SERVICE in d.metadata["uuids"]:
            relevant_devices.append(d)
    
    return relevant_devices

async def scan_bt():
    scanner = BleakScanner()
    devices = await scanner.discover(timeout=5.0)
    return filter_cycling_accessories(devices)
    #return devices

async def async_main():
    global BT_DEVICES
    devices = await scan_bt()
    BT_DEVICES = devices
    return devices


def threaded_scan():
    global BT_DEVICES
    BT_DEVICES = asyncio.run(async_main())

if __name__ == "__main__":
    PAIR_HISTORY = []
    # read previously paired devices from file
    if os.path.exists(".appdata/bt_history.temp"):
        with open(".appdata/bt_history.temp", "r") as f:
            for line in f:
                PAIR_HISTORY.append(line.strip())

    # Scan for bluetooth devices in a separate thread
    while len(BT_DEVICES) < 2:
        # unpair previously connected bluetooth devices by ID
        for id in PAIR_HISTORY:
            subprocess.call(["bluetoothctl", "remove", id], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            #os.system(f"sudo bluetoothctl remove {id}")
        print("Scanning...")
        t = Thread(target=threaded_scan)
        t.start()
        print("Please wait")
        # we can do other things while the scan is running
        for i in range(5):
            print(5-i)
            time.sleep(1)
        t.join()
        print("Done scanning")
        print(BT_DEVICES)
    
    print("2 Devices found. Immediately connecting...")
    # write BT_DEVICES contents to a file 
    # so that we can remember to unpair them
    # the next time we run this script
    with open(".appdata/bt_history.temp", "w") as f:
        for d in BT_DEVICES:
            f.write(f"{d.address}\n")

    # Connect to each device in a separate process
    import multiprocessing

    procs = []
    for d in BT_DEVICES:
        p = multiprocessing.Process(target=asyncio.run, args=(connect_to_device(d),))
        procs.append(p)
        p.start()
    
    for i in range(20):
        print(20-i)
        time.sleep(1)
    

    print("Killing first process for fun")
    p = procs[1]
    p.terminate()
    p.join()

    time.sleep(5)
    # start the same process again
    p_new = multiprocessing.Process(target=asyncio.run, args=(connect_to_device(BT_DEVICES[1]),))

    print("Starting process again")
    procs.append(p_new)
    p_new.start()

    
    # this try-except block fixes problem where KeyboardInterrupt is made useless by multiprocessing
    try:
        for p in procs:
            p.join()
    except KeyboardInterrupt:
        # kill multiprocessing processes
        print(f"Terminating {len(procs)} processes")
        for p in procs:
            p.terminate()
            p.join()
        
        print("Done")





