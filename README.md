> [!WARNING]  
> This project is no longer maintained. It has been replaced by [metacycle](https://github.com/tensorturtle/metacycle).

![banner](logo/cycarla-github-banner.png)

# Introduction

CyCARLA is an open source cycling simulator. It pairs with smart indoor cycling accessories to offer the highest degree of in-game control and feedback, providing the ultimate interactive indoor cycling experience.

# The Story

CyCARLA was created in 2021 by [tensorturtle](https://github.com/tensorturtle) for a fun and imaginative 'future of cycling vision' demo by Boreal Bikes GmbH at the [Bike2CAV](https://www.bike2cav.at/en/home-2/) consortium presentation at Salzburg Research.

In 2023, CyCARLA was officially adopted and re-written by [Velovision Labs](https://github.com/velovision) as an AI training and validation environment. It was crucial to the development of [Velovision Rearview](https://velovision.app) and its advanced computer vision algorithms. See Tesla's [simulation presentation (YouTube)](https://www.youtube.com/live/j0z4FweCy4M?si=XWvyaFaxmshTBO1n&t=5715) to get a sense of how CyCARLA is used at Velovision Labs.

This project is a free, open source fork maintained by [tensorturtle](https://github.com/tensorturtle), the original author of CyCARLA, with the goal of creating a superior, free, and modifiable alternative to indoor cycling games like Zwift.

![](readme_assets/town-15-riding.png)

# Requirements

Commercial indoor cycling games sacrifice graphics, control, and customizability in favor of compatibility with a wide range of devices. CyCARLA is different. CyCARLA requires a relatively high-performance computer, a smart trainer, and a smart steering plate. In return, CyCARLA offers unlimited freedom to roam the numerous maps and modify everything about the environment or the game itself.

To reiterate, you need the following:

1. A bike, such as [this absolute beauty](https://www.bastioncycles.com/)
2. [Elite Sterzo](https://www.elite-it.com/en/products/home-trainers/ecosystem-accessories/sterzo-smart) front wheel steering plate.
3. Smart Trainer, such as [Elite Suito T](https://www.elite-it.com/en/products/home-trainers/interactive-trainers/suito-t)
4. A gaming computer (with dedicated GPU) running Windows 10 or Ubuntu 22.04. See [more detailed requirements](#computer-requirements)


# Installation

Currently, you need to follow this installation guide to install three different programs. It will then show you how to launch them as a single Application.

## Ubuntu

### 1. Install CARLA Simulator

Full instructions: [see CARLA documentation](https://carla.readthedocs.io/en/latest/start_quickstart/#carla-installation). The following is an abbreviated, recommended way.

Download [CARLA 0.9.15 pre-compiled ZIP for Ubuntu](https://carla-releases.s3.us-east-005.backblazeb2.com/Linux/CARLA_0.9.15.tar.gz). 

We'll create a new `carla` directory in the home directory to place CARLA content. This is used as the default in following steps so if you decide to change it, pay attention to when this path comes up later.

```
mkdir -p ~/carla
```

Go to where the ZIP was downloaded, assumed to be `~/Downloads` and extract it to the new directory.
```
cd ~/Downloads
tar -xvf CARLA_0.9.15.tar.gz -C ~/carla
```

### 2. Install Cycarla Agent

Please navigate to [releases](https://github.com/tensorturtle/cycarla/releases) page and download the `cycarla_agent` appropriate for your machine. 

Assuming it was downloaded to `~/Downloads`, rename it to `cycarla-gent` and move it to `~/.local/bin`, or somewhere else on PATH.

For example:
```
mv ~/Downloads/cycarla_app-linux-x86_64 ~/.local/bin/cycarla-app
```

### 3. Install Cycarla App

Very similar to the previous step.

Download `cycarla_app` from [releases](https://github.com/tensorturtle/cycarla/releases), rename it and move it:

For example:
```
mv ~/Downloads/cycarla_app-linux-x86_64 ~/.local/bin/cycarla-app
```

### 4. Manual Installation as Single App in Ubuntu

First, move all three binaries to a directory in PATH, such as: `~/.local/bin`:

CyCARLA App:


CyCARLA Agent:
```
mv ~/Downloads/cycarla_agent-linux-x86_64 ~/local/bin/cycarla-agent
```

Now, all three programs should be runnable just by typing in `carla`, `cycarla-app` or `cycarla-agent` on the command line from anywhere.

Next, we create a single script that launches all three simulataneously, and also terminates them if the script is ended by the user.

Create a convenient directory for this script:
```
mkdir -p ~/cycarla
```

Download [the logo icon](/logo/cycarla-logo-icon.png) and put it in that directory.

Create a bash script:
```
vim ~/cycarla/launch-script.sh
```

With content:
```
#!/bin/bash

CARLA_PATH="~/carla" # default. Feel free to change.

cycarla-agent &
PID_A=$!

cycarla-app &
PID_B=$!

# Adopted from CarlaUE4.sh launch script
UE4_PROJECT_ROOT=$(eval echo "$CARLA_PATH")
chmod +x "$UE4_PROJECT_ROOT/CarlaUE4/Binaries/Linux/CarlaUE4-Linux-Shipping"
"$UE4_PROJECT_ROOT/CarlaUE4/Binaries/Linux/CarlaUE4-Linux-Shipping" CarlaUE4 &
PID_C=$!

# Define a cleanup function to kill both applications
cleanup() {
    echo "Terminating applications..."
    kill $PID_A $PID_B $PID_C
    wait $PID_A $PID_B $PID_C 2>/dev/null
}

# Trap signals to ensure cleanup happens
trap cleanup EXIT INT TERM

# Wait for both processes (this keeps the script running)
wait $PID_A $PID_B $PID_C
```

Create a `cycarla.desktop` file in `~/.local/share/applications`

```
vim ~/.local/share/applications/cycarla.desktop
```
With content:
```
[Desktop Entry]
Version=1.0
Type=Application
Name=CyCARLA
Exec=~/cycarla/launch-script.sh
Icon=~/cycarla/cycarla-logo-icon.png
Terminal=true
Categories=Game;
```

Make sure it's permissioned correctly:
```
sudo chmod 664 ~/.local/share/applications/cycarla.desktop
```

That's it! Now you should be able to see the CyCARLA App icon in the app menu. Click it to launch everything.

## Windows

### 1. Install CARLA Simulator

Download [CARLA 0.9.15 pre-compiled ZIP for Windows](https://tiny.carla.org/carla-0-9-15-windows). Other versions can be found [here](https://github.com/carla-simulator/carla/releases)

Unzip it and find `CarlaUE4.exe`. Double click to launch it.

Right-click on the icon and pin it to the taskbar.


### Next Steps

Coming Soon

**Enjoy your ride!**

![](readme_assets/riding-in-the-park.png)

*Roaming about in CyCARLA - you can go anywhere!*

# Community & Support

## Pull Requests

CYCARLA accepts Pull Requests. If you have an improvement idea and have experience in Python / Javascript, please go ahead and submit and Issue. Let's discuss!

## Donations

This is a personal free-time project. If CyCARLA helped you avoid expensive subscriptions and want to see it get better, please consider [making a donation!](https://buy.stripe.com/aEUeVkaAuc8XgP69AB) 

## Open Source

CYCARLA is MIT licensed.

CyCARLA is made possible thanks to the following open source projects:
+ [Unreal Engine](https://github.com/EpicGames)
+ [CARLA](https://github.com/carla-simulator/carla)
+ [Pycycling](https://github.com/zacharyedwardbull/pycycling) - major contributions made to this project by [tensorturtle](https://github.com/tensorturtle)

## Computer Requirements

CYCARLA is based Unreal Engine 4, a serious 3D game engine with full customizability, so it'll be more demanding than typical indoor cycling games.

+ CPU: Intel Core i5 6th-gen or better.
+ GPU: NVIDIA RTX 2070 or better (2080, 3060, 3070, 3080, 4060, 4070, 4080 etc.)
+ Hard drive: 30GB of free space.
+ Bluetooth Low Energy (BLE) support.
+ Internet connection required for installation, not required to run the game.

## Versioning

This project uses SemVer. 

Since two binaries are distributed, they are related as follows:
+ The two binaries must be compatible within the same major and minor versions (x.y._), where x and y match.
+ Patch versions (0.0.z) don't need to match - they are used for bug fixes that don't affect the interoperability of the two programs.
