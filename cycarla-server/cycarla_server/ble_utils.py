from bleak import BleakScanner

from enum import Enum

import platform
import subprocess

def restart_system_bluetooth():
    '''
    We found that bluetooth needs to be restarted 
    in order to be able to scan for devices again.
    '''
    subprocess.call(["bluetoothctl", "power", "off"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    subprocess.call(["bluetoothctl", "power", "on"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

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

    for bledevice, advertisement_data in devices.values():
        services = advertisement_data.service_uuids
        if BLECyclingService.STERZO.value in services: 
            relevant_devices['sterzos'].append(bledevice)
        if BLECyclingService.FITNESS.value in services and BLECyclingService.POWERMETER.value in services:
            relevant_devices['smart_trainers'].append(bledevice)

    return relevant_devices

async def scan_bt():
    restart_system_bluetooth()
    scanner = BleakScanner()
    devices = await scanner.discover(timeout=2.0, return_adv=True)
    cycling_devices = filter_cycling_accessories(devices)
    serialized_cycling_devices = {
        'sterzos': [serialize_bledevice(d) for d in cycling_devices['sterzos']],
        'smart_trainers': [serialize_bledevice(d) for d in cycling_devices['smart_trainers']],
    }
    return serialized_cycling_devices

async def scan_bt_async_runner():
    return await scan_bt()

def serialize_bledevice(d):
    return {
        "name": d.name,
        "address": d.address,
    }
