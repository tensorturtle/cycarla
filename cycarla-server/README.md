`cycarla-server` is a Python Flask server within a poetry project that runs within a Ubuntu 22.04 docker container.

# Carla Python Client

CARLA does not provide a python client library for CARLA 0.9.14 for anything besides Python 3.7. 

Our Ubuntu 22.04 installation has Python 3.10, so a different build is required. Thankfully, someone built it for us:
https://github.com/gezp/carla_ros/releases

The relevant wheel file has been downloaded as `carla-0.9.14-cp310-cp310-linux_x86_64.whl`. It is copied to the Docker image when it is built.


# Build Docker Image

From this directory,

```
docker build -t cycarla_server .
```

# Run Docker Image

This server connects to a running CARLA simulation, so it requires the server's IP and port.

If you're running the simulator in the same computer, use:
```
export CARLA_SIM_IP=127.0.0.1
export CARLA_SIM_PORT=2000
```

If you're using a different computer on your local network, find its IP. As an example:
```
export CARLA_SIM_IP=172.30.1.43
export CARLA_SIM_PORT=2000
```

The port is by default 2000 unless you set them otherwise.

For debugging, run the image without the `entrypoint.sh` script:
```
docker run -e CARLA_SIM_IP -e CARLA_SIM_PORT --rm -it --network=host --privileged -v /var/run/dbus:/var/run/dbus -v .:/workspaces/cycarla/cycarla-server cycarla_server
```
Then:
```
cd /workspaces/cycarla/cycarla-server
./entrypoint.sh
```

For deployment combine the above:
```
docker run -e CARLA_SIM_IP -e CARLA_SIM_PORT --rm -it --network=host --privileged -v /var/run/dbus:/var/run/dbus -v .:/workspaces/cycarla/cycarla-server cycarla_server /workspaces/cycarla/cycarla-server/entrypoint.sh
```
