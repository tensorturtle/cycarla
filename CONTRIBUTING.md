# Platforms

CyCARLA targets Ubuntu 20.04 and Windows 10, same as CARLA.

# Development Environment

## Hardware

At the bare minimum, the following are required:

+ Elite Sterzo Smart steering sensor
+ BLE-compatible Cycling Wheel Speed sensor (such as Garmin Bike Speed Sensor 2, Magene S3+, Wahoo RPM Cycling Speed Sensor)
+ Bluetooth Dongle with version 5.0 or greater, supporting Bluetooth Low Energy (BLE). Premium motherboards / laptops often have them built-in.
+ Ubuntu 20.04 computer with NVIDIA GPU RTX[2070, 2080, 3070, 3080 or similar].

## Software Environment:

1. Install poetry
2. Clone this repository `git clone git@github.com:tensorturtle/cycarla.git`
3. `cd cycarla` to navigate to downloaded repo
4. `poetry install` to download and install dependencies in python poetry virtual environment
5. `poetry shell` for a convenient shell where dependencies and python version are as defined in poetry configuration.

# Things to do

## Features

### Short-Term

+ [ ] Implement Resistance control based on incline and in-CARLA kinematics via Bluetooth FTMS
  + [ ] Add BLE-FTMS profile and example to `pycycling`
+ [ ] Autopilot mode for bikes

### Long-term
+ [ ] Customizable bike / kit / character
+ [ ] Cycling-friendly maps
+ [ ] Race features
+ [ ] Hilly terrain

## Maintenance / Meta

+ [ ] Bump CARLA version overall to 0.9.14 When pypi (pip) gets 0.9.14 client library.
+ [ ] Automated linter, formatter through pre-commit hooks

## Hacks / Things to Improve

which should be solved more elegantly

+ [ ] Bluetooth devices stay paired when app exits. The hack is to remember which devices were connected in a file, and then unpair them on app start. This won't work well if the bluetooth accessory will be used by other hosts.
+ [ ] All child processes and found and SIGKILLed on app exit. This hack prevents app from not returning to terminal because of some multiprocessing process that doesn't end. However, it is not a graceful shutdown.

