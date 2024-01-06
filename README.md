![banner](logo/cycarla-github-banner.png)

# Librate indoor cycling!

**Freedom is why we ride.** CYCARLA is about:

+ **Freedom** to explore the world, just like riding outside. 
+ **Freedom** to modify the game: The entire codebase is open source.
+ **Free** as in free beer! This project is backed by donations and community support.

Bring your Bluetooth-compatible indoor cycling accessories and liberate your indoor riding!

# Getting Started

You'll need the following equipment to ride in CYCARLA:

1. A bike, such as [this absolute beauty](https://www.bastioncycles.com/)
2. [Elite Sterzo](https://www.elite-it.com/en/products/home-trainers/ecosystem-accessories/sterzo-smart) front wheel steering plate.
3. Smart Trainer, such as [Elite Suito T](https://www.elite-it.com/en/products/home-trainers/interactive-trainers/suito-t)
4. A gaming computer running Windows 10 or Ubuntu 22.04

## Computer Requirements

CYCARLA is based on a serious 3D game engine with full customizability, so it'll be more demanding than typical indoor cycling games.

+ CPU: Intel Core i5 6th-gen or better
+ GPU: NVIDIA RTX 2070 or better (2080, 3060, 3070, 3080, etc.)
+ Hard drive: 30GB of free space.
+ Bluetooth Low Energy (BLE) support
+ Internet connection required for installation, not required to run the game.

[System76 make good Linux-first computers](https://system76.com/laptops/oryx) (no affiliation)

# Installation

To run CYCARLA, three components need to be installed:
1. CARLA simulator
2. Backend
3. Frontend

Please follow the directions below carefully for each component.

## CARLA Simulator Installation

### Windows

Download [CARLA 0.9.15 pre-compiled ZIP](https://carla-releases.s3.eu-west-3.amazonaws.com/Windows/CARLA_0.9.15.zip) from https://github.com/carla-simulator/carla/releases

Unzip it and find `CarlaUE4.exe` and run it.

### Ubuntu

While it is possible to [install CARLA natively](https://carla.readthedocs.io/en/latest/start_quickstart/#carla-installation), I recommend using Docker. On Pop OS, only the Docker method works.

Install Docker:
```
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

Run CARLA inside docker:
```
docker run --privileged --gpus all --network=host -e DISPLAY=$DISPLAY carlasim/carla:0.9.15 /bin/bash ./CarlaUE4.sh
```
When run for the first time, it will download the large CARLA image (~20GB).

## Backend Installation

Please follow [Backend Installation instructions](https://github.com/tensorturtle/cycarla/blob/main/cycarla-backend/README.md).

## Frontend Installation

Please follow [Frontend installation instructions](https://github.com/tensorturtle/cycarla/blob/main/cycarla-frontend/README.md)

# Run CYCARLA

If you've finished the above installation steps, the full app can now be launched:

1. Launch CARLA simulator
  + Windows: Double click `CarlaUE4.exe`
  + Ubuntu: `docker run --privileged --gpus all --network=host -e DISPLAY=$DISPLAY carlasim/carla:0.9.15 /bin/bash ./CarlaUE4.sh`
2. Launch Backend: `cycarla_backend` from your terminal or powershell.
3. Launch Frontend: `cd cycarla-frontend` and then `npm run dev` from a second terminal or powershell.

# Open Source

![project-structure-diagram](graphics/CyCARLA-figmadiagram-1.png)
*High level project structure of CYCARLA*

CYCARLA follows in the footsteps of some wonderful open source projects:
+ [Unreal Engine](https://github.com/EpicGames) (Sign up with Epic Games to access Unreal Engine repo)
+ [CARLA](https://github.com/carla-simulator/carla)
+ [Pycycling](https://github.com/zacharyedwardbull/pycycling)

CYCARLA accepts Pull Requests. If you have an improvement idea, submit an Issue and let's discuss!

CYCARLA is MIT licensed.

# [Donate](https://buy.stripe.com/aEUeVkaAuc8XgP69AB)

If you find CYCARLA valuable, please [make a donation!](https://buy.stripe.com/aEUeVkaAuc8XgP69AB) 

Funds go towards purchasing equipment to work on compatibility, feature development, and to my self-preservation fund.

# [Community on Discord]()

CYCARLA began two years ago as a fun 'future of cycling vision' demo at the [Bike2CAV](https://www.bike2cav.at/en/home-2/) consortium presentation at Salzburg Research. Since then it has been my passion project.

Users, contributors, and anyone else interested in this project are invited to the Discord, [so join us there!]()

# Fun Facts

CYCARLA is also stylized 'CyCARLA' or 'Cycarla'

It is pronounced: *"sai-karla"*
