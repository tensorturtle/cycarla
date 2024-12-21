import sys
import subprocess
from enum import Enum

from bleak import BleakScanner

is_windows = sys.platform =="win32"
is_linux = sys.platform.startswith("linux")

def restart_system_bluetooth():
    '''
    We found that bluetooth needs to be restarted 
    in order to be able to scan for devices again.
    '''
    if is_linux:
        print("Restarting system bluetooth")
        subprocess.call(["bluetoothctl", "power", "off"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        subprocess.call(["bluetoothctl", "power", "on"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    elif is_windows:
        print("Skipping restart of system bluetooth because it is not required on Windows")

    else:
        print("Unknown OS")

class BLECyclingService(Enum):
    '''
    BLE Services and Characteristics that are broadcasted by the devices themselves when being scanned.

    Some are assigned: https://www.bluetooth.com/specifications/assigned-numbers/
    Others (like STERZO) are just made up by the manufacturer.
    '''
    STERZO = "347b0001-7635-408b-8918-8ff3949ce592"
    FITNESS = "00001826-0000-1000-8000-00805f9b34fb"
    POWERMETER = "00001818-0000-1000-8000-00805f9b34fb"

def filter_cycling_accessories(devices):
    relevant_devices = {
        'sterzos': [],
        'smart_trainers': [],
    }

    for k,v in devices.items():
        bledevice, advertisement_data = v
        services = advertisement_data.service_uuids

        if BLECyclingService.STERZO.value in services: 
            relevant_devices['sterzos'].append(bledevice)
        if BLECyclingService.FITNESS.value in services and BLECyclingService.POWERMETER.value in services:
            relevant_devices['smart_trainers'].append(bledevice)
    print(f"Found {len(relevant_devices['sterzos'])} sterzos and {len(relevant_devices['smart_trainers'])} smart trainers")
    return relevant_devices

async def scan_bt():
    restart_system_bluetooth()
    scanner = BleakScanner()
    print("Scanning for BLE devices")
    devices = await scanner.discover(timeout=2.0, return_adv=True)
    print(f"Found {len(devices)} devices")
    return filter_cycling_accessories(devices)

async def scan_bt_async_runner():
    return await scan_bt()

def serialize_bledevice(d):
    return {
        "name": d.name,
        "address": d.address,
    }
