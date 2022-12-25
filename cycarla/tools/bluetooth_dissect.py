# bluetooth_dissect.py
# Scan for bluetooth devices and print out
# all services, characteristics, and descriptors.
#
# Basic interactive usage:
#   poetry run python bluetooth_dissect.py
#
# If you know the address:
#   poetry run python bluetooth_dissect.py -d XX:XX:XX:XX:XX:XX
# where XX:XX:XX:XX:XX:XX is the bluetooth address
#
# To simply list available devices:
#   poetry run python bluetooth_dissect.py -l

import asyncio
import argparse

# install bleak using pip
import bleak
from bleak import BleakScanner
from bleak.exc import BleakDBusError, BleakDeviceNotFoundError


async def bt_spiller(bt_address):
    """
    Enumerate all Service, Characteristic, and Descriptors \
        for a given BT device.
    """
    loop = asyncio.get_event_loop()
    client = bleak.BleakClient(bt_address, loop=loop)
    try:
        await client.connect()
    except BleakDBusError:
        print(
            "Could not connect to device. \
                Please make sure it is powered on and in range."
        )
        exit()
    except BleakDeviceNotFoundError:
        print(
            "Could not find device. \
            Please make sure the address is correct."
        )
        exit()
    services = client.services

    print("_" * 80, "\n")
    print(f"Information for device: {client.address}\n")

    for i, service in enumerate(services):
        print(f"=== SERVICE {i+1} ===")
        print("Service UUID:", service.uuid)
        print("Service handle: ", service.handle)
        print("Service description: ", service.description)
        for j, characteristic in enumerate(service.characteristics):
            print(f"\t=== CHARACTERISTIC {j+1} ===")
            print("\tCharacteristic UUID: ", characteristic.uuid)
            print("\tCharacteristic handle: ", characteristic.handle)
            print("\tCharacteristic description: ", characteristic.description)
            print("\tCharacteristic properties: ", characteristic.properties)
            for k, descriptor in enumerate(characteristic.descriptors):
                print(f"\t\t=== DESCRIPTOR {k+1} ===")
                print("\t\tDescriptor UUID: ", descriptor.uuid)
                print("\t\tDescriptor handle: ", descriptor.handle)
                print("\t\tDescriptor description: ", descriptor.description)
                print()
            print()
        print()


def list_devices():
    # scan for devices
    print("Available devices:")
    devices = asyncio.run(BleakScanner.discover())
    for d in devices:
        print(d)
    print()


if __name__ == "__main__":
    # parse bluetooth address from command line
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-l", "--list", help="List available devices", action="store_true"
    )
    parser.add_argument(
        "-d",
        "--device-address",
        help="Bluetooth address of the device to connect to",
        type=str,
    )
    args = parser.parse_args()

    # if no devices are specified, list available devices
    if args.list:
        list_devices()
        exit()

    # if no device address is specified, prompt user for one
    if not args.device_address:
        print("Please select a device Number from the list below.\n")
        devices = asyncio.run(BleakScanner.discover())
        print("Number\t| Address\t\t| Name")
        print("-------\t| -------\t\t| ----")
        for i, d in enumerate(devices):
            print(f"{i}\t| {d.address}\t| {d.name}")
        print()
        device_number = int(input("Type device number: "))
        bt_address = devices[device_number].address
    else:
        bt_address = args.device_address

    asyncio.run(bt_spiller(bt_address))
