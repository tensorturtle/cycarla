`cycarla-backend` is a Python Flask server that serves as the backend to [CYCARLA](https://github.com/tensorturtle/cycarla)

The three components of Cycarla are:
1. [CARLA](https://github.com/carla-simulator/carla) - An open-source simulator for autonomous driving research.
2. [cycarla_backend](https://github.com/tensorturtle/cycarla/tree/main/cycarla-backend) - This Python Flask server which links the frontend to CARLA.
3. [cycarla_frontend](https://github.com/tensorturtle/cycarla/tree/main/cycarla-frontend) - A Javascript (Next.js) front-end which presents a web-based interface from your browser.

# Installation

Supported platforms: Windows 10, Ubuntu 22.04. Other versions can work if you install Python 3.10 and pipx.

## Windows 10-specific Prerequisites

If you are on Ubuntu 22.04, skip ahead to the next section. Windows needs a couple of things to be set up beforehand.

### [**1. Install Python 3.10**](https://www.python.org/downloads/release/python-31011)

Scroll to the bottom and download the 'Windows Installer (64-bit)'.

At the installer, make sure to enable the bottom option "Add python.exe to PATH"

### [**2. Install Scoop**](https://scoop.sh/)

## Install using `pipx`

`cycarla-backend` is a CLI package that is developed with [poetry](https://python-poetry.org/) and published on [pypi](https://pypi.org/project/cycarla-backend/).

We'll use `pipx` to run it in an isolated python environment.

### [**Install `pipx`**](https://github.com/pypa/pipx#install-pipx)

Follow relevant instructions for your platform

### **Install cycarla-backend** using `pipx`
```
pipx install cycarla-backend
```
Note the dash (minus) sign.

# Run App

In your terminal (Ubuntu) or Powershell (Windows):
```
cycarla_backend
```
Note the underscore.

On Windows, Allow firewall permissions when prompted.

## Next Steps

When the app starts, you should see a command line output including:
```
 * Running on http://127.0.0.1:9000
```

This app will receive web requests from the CYCARLA Frontend which should run at localhost port 3000, and communicate with the Python API of a local CARLA simulator whose default port is 2000.

You should start the CARLA and frontend applications next, if they haven't been started already.

See [CYCARLA top-level project README](https://github.com/tensorturtle/cycarla) for more information


# Errata

+ Currently, Windows 10 and Ubuntu 22.04 are the officially supported OSes for the CYCARLA project. Mac is not supported because CARLA can't run on it.
+ It is possible to run CARLA and this backend on two different computers, but it is very slow (~5 FPS).
