# CyCARLA
**Ride your bike in CARLA virtual simulator with off-the-shelf indoor cycling accessories.**

## Launch Carla

```
/opt/carla-simulator/CarlaUE4.sh -RenderOffScreen
```

## Launch App

```
poetry shell
```
From repository root,
```
cd cycarla
```

```
python3 app.py
```

## Hacks

which should be solved more elegantly

+ [ ] Bluetooth devices stay paired when app exits. The hack is to remember which devices were connected in a file, and then unpair them on app start. This won't work well if the bluetooth accessory will be used by other hosts.
+ [ ] All child processes and found and SIGKILLed on app exit. This hack prevents app from not returning to terminal because of some multiprocessing process that doesn't end. However, it is not a graceful shutdown.
