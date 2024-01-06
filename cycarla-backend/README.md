`cycarla-backend` is a Python Flask server that serves as the backend to [CYCARLA](https://github.com/tensorturtle/cycarla)

The three components of Cycarla are:
1. [CARLA](https://github.com/carla-simulator/carla)
2. [cycarla_backend](https://github.com/tensorturtle/cycarla/tree/main/cycarla-backend)
3. [cycarla_frontend](https://github.com/tensorturtle/cycarla/tree/main/cycarla-frontend)

# Platform-specific prerequisites.

## Windows 10

[**Install Python 3.10**](https://www.python.org/downloads/release/python-31011)

Scroll to the bottom and download the 'Windows Installer (64-bit)'.

Make sure to enable the bottom option "Add python.exe to PATH"

[**Install Scoop**](https://scoop.sh/)

## Ubuntu 22.04

Ubuntu 22.04 comes with Python 3.10, so continue on to Installation.

# Install & Run `cycarla-backend`

[**Install `pipx`**](https://github.com/pypa/pipx#install-pipx)

**Install cycarla-backend** using `pipx`
```
pipx install cycarla-backend
```

Now run 

```
cycarla-backend
```

On Windows, Allow firewall permissions when prompted.


# Errata

+ It is possible to run CARLA and this backend on two different computers, but it is very slow (~5 FPS).
