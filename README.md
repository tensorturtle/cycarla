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
4. A GPU-equipped computer running Linux

## Computer Requirements

Basically, you'll need a gaming computer.

+ CPU: Intel Core i5 or better
+ GPU: NVIDIA RTX 2070 or better (2080, 3060, 3070, 3080, etc.)
+ Hard drive: 10GB of free space.
+ Bluetooth Low Energy (BLE) support
+ Internet connection required for installation, not required to run the game.

[System76 make good Linux-first computers](https://system76.com/laptops/oryx) (no affiliation)

Currently, CYCARLA is developed on and for Debian-family Linux (Ubuntu, PopOS).

Keep in mind CYCARLA is based on a serious 3D game engine with full customizability, so it'll be more demanding than typical indoor cycling games.

## Installation on Windows

Download [CARLA 0.9.15 pre-compiled ZIP](https://carla-releases.s3.eu-west-3.amazonaws.com/Windows/CARLA_0.9.15.zip) from https://github.com/carla-simulator/carla/releases

Unzip it and find `CarlaUE4.exe` and run it.

Clone this repository. See [server](cycarla-server/README.md) and [controller](cycarla-controller/README.md) READMEs for their Windows native installation instructions.

## Installation on Ubuntu

Clone this repository:
```
git clone https://github.com/tensorturtle/cycarla
```

Install docker:
```
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

Install NVM in order to install NPM:
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```
```
nvm install 20
nvm use 20
```
```
./run_controller.sh
```
Go to `localhost:3000` on your browser.

## Quickstart (Ubuntu)

Run each command in a new shell:
```
./run_carla.sh
```
```
./run_server.sh
```
```
./run_controller.sh
```

Go to `localhost:3000` on your web browser.

## Quickstart (Windows)

Run CARLA.exe

In powershell,
```
cd cycarla-server
poetry run python cycarla_server\main.py
```

In another powershell,
```
cd cycarla-controller
npm run dev
```

Go to `localhost:3000` on your web browser.

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

# Errata

CYCARLA is also stylized 'CyCARLA' or 'Cycarla'

It is pronounced: *"sai-karla"*
