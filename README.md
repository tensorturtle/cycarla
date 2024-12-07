![banner](logo/cycarla-github-banner.png)

# Introduction

CyCARLA is an open source cycling simulator. It pairs with smart indoor cycling accessories to offer the highest degree of in-game control and feedback, providing the ultimate interactive indoor cycling experience.

# The Story

CyCARLA was created in 2021 by [tensorturtle](https://github.com/tensorturtle) as a fun and imaginative 'future of cycling vision' demo by Boreal Bikes GmbH at the [Bike2CAV](https://www.bike2cav.at/en/home-2/) consortium presentation at Salzburg Research.

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


# Download & Install

Three different programs need to be installed and run together.

1. CARLA simulator (without modifications): Please see [CARLA documentation](https://carla.readthedocs.io/en/latest/start_quickstart/#carla-installation) for full instructions. See below for simplified instructions.
2. CyCARLA App: Please navigate to the "releases" page in this Github repository and download the installer (Windows) or AppImage (Linux).
3. CyCARLA Agent: Same as above.

## CARLA Simulator Installation (Simplified)

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

# Run CyCARLA

If you've finished the above installation steps, the full app can now be launched:

1. Launch CARLA simulator
  + Windows: Double click `CarlaUE4.exe`
  + Ubuntu: Navigate to where you installed carla (in the above example `~/carla`) and run `./CarlaUE4.sh`
2. Launch CyCARLA App
3. Launch CyCARLA Agent

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
