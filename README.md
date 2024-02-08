![banner](logo/cycarla-github-banner.png)

# Librate indoor cycling!

**Freedom is why we ride.** CYCARLA is about:

+ **Freedom** to explore the world, just like riding outside. 
+ **Freedom** to modify the game: The entire codebase is open source.
+ **Free** as in free beer! This project is backed by donations and community support.

Bring your Bluetooth-compatible indoor cycling accessories and liberate your indoor riding!

# What you'll need

1. A bike, such as [this absolute beauty](https://www.bastioncycles.com/)
2. [Elite Sterzo](https://www.elite-it.com/en/products/home-trainers/ecosystem-accessories/sterzo-smart) front wheel steering plate.
3. Smart Trainer, such as [Elite Suito T](https://www.elite-it.com/en/products/home-trainers/interactive-trainers/suito-t)
4. A gaming computer running Windows 10 or Ubuntu 22.04. See [more detailed requirements](#computer-requirements)


# Installation

To run CYCARLA, three components need to be installed:
1. CARLA simulator
2. Backend
3. Frontend

Please carefully follow the directions below for each component.

## CARLA Simulator Installation

Please see [CARLA documentation](https://carla.readthedocs.io/en/latest/start_quickstart/#carla-installation) for full instructions. The following is a simplified version.

### Windows

Download [CARLA 0.9.15 pre-compiled ZIP for Windows](https://carla-releases.s3.eu-west-3.amazonaws.com/Windows/CARLA_0.9.15.zip). Other versions can be found [here](https://github.com/carla-simulator/carla/releases)

Unzip it and find `CarlaUE4.exe`. Double click to launch it.

Right-click on the icon and pin it to the taskbar.

### Ubuntu

Download [CARLA 0.9.15 pre-compiled ZIP for Ubuntu](https://carla-releases.s3.us-east-005.backblazeb2.com/Linux/CARLA_0.9.15.tar.gz). 

We'll create a new `carla` directory in the home directory to place CARLA app content.

```
mkdir -p ~/carla
```

Go to where the ZIP was downloaded, probably `~/Downloads` and extract it to the new directory.
```
cd ~/Downloads
tar -xvf CARLA_0.9.15.tar.gz -C ~/carla
```

Now, we can run the binary. Be patient when it doesn't respond at launch.
```
~/carla/CarlaUE4.sh
```

## Install Backend

```
pipx install cycarla-backend
```

Please follow [Backend Installation instructions](https://github.com/tensorturtle/cycarla/blob/main/cycarla-backend/README.md)


## Install Frontend

```
npm i cycarla-frontend
```

Please follow [Frontend installation instructions](https://github.com/tensorturtle/cycarla/blob/main/cycarla-frontend/README.md)

# Run CYCARLA

If you've finished the above installation steps, the full app can now be launched:

1. Launch CARLA simulator
  + Windows: Double click `CarlaUE4.exe`
  + Ubuntu: Navigate to `CarlaUE4/Binaries/Linux` and execute: `./CarlaUE4-Linux-Shipping`
2. Launch Backend: `cycarla_backend`
3. Launch Frontend: `npx cycarla-frontend`
4. On your web browser, go to `localhost:3000`

# Open Source

![project-structure-diagram](graphics/CyCARLA-figmadiagram-1.png)
*High level project structure of CYCARLA*

CYCARLA follows in the footsteps of some wonderful open source projects:
+ [Unreal Engine](https://github.com/EpicGames) (Sign up with Epic Games to access Unreal Engine repo)
+ [CARLA](https://github.com/carla-simulator/carla)
+ [Pycycling](https://github.com/zacharyedwardbull/pycycling) - I also contributed to this!

CYCARLA accepts Pull Requests. If you have an improvement idea, submit an Issue and let's discuss!

CYCARLA is MIT licensed.

# [Donate](https://buy.stripe.com/aEUeVkaAuc8XgP69AB)

If you find CYCARLA valuable, please [make a donation!](https://buy.stripe.com/aEUeVkaAuc8XgP69AB) 

Funds go towards purchasing equipment to work on compatibility, feature development, and to my self-preservation fund.

# Fun Facts

CYCARLA began two years ago as a fun 'future of cycling vision' demo at the [Bike2CAV](https://www.bike2cav.at/en/home-2/) consortium presentation at Salzburg Research. Since then it has been my passion project.

CYCARLA is also stylized 'CyCARLA' or 'Cycarla'

It is pronounced: *"sai-karla"*

## Computer Requirements

CYCARLA is based on a serious 3D game engine with full customizability, so it'll be more demanding than typical indoor cycling games.

+ CPU: Intel Core i5 6th-gen or better
+ GPU: NVIDIA RTX 2070 or better (2080, 3060, 3070, 3080, etc.)
+ Hard drive: 30GB of free space.
+ Bluetooth Low Energy (BLE) support
+ Internet connection required for installation, not required to run the game.
