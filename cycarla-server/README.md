`cycarla-server` is a Python Flask server within a poetry project that runs within a Ubuntu 22.04 docker container.

# Carla Python Client

CARLA does not provide a python client library for CARLA 0.9.14 for anything besides Python 3.7. 

Our Ubuntu 22.04 installation has Python 3.10, so a different build is required. Thankfully, someone built it for us:
https://github.com/gezp/carla_ros/releases

The relevant wheel file has been downloaded as `carla-0.9.14-cp310-cp310-linux_x86_64.whl`. It is copied to the Docker image when it is built.


# Build Docker Image

From this directory,

```
docker build --platform linux/amd64 -t cycarla_server.
```

+ The `platform` argument exists because `ubuntu:22.04` is a multi-architecture image but we want the x86_64 one specifically for compatibility with the carla wheel.


# Run Docker Image

See [run_server.sh](../run_server.sh).

This server connects to a running CARLA simulation, so it requires the server's IP and port.

The CARLA simulation [run_carla.sh](../run_carla.sh) and this cycarla server [run_server.sh](../run_server.sh) should be run on the same computer, communicating across localhost.

While it is possible to run the CARLA simulation and server on different computers, it will be very slow ( < 5 fps). 

If you're using a different computer on your local network, use its local network IP. As an example:

```
export CARLA_SIM_IP=172.30.1.43
export CARLA_SIM_PORT=2000
```

The port is by default 2000 unless you set them otherwise.

For debugging, run the image without the `entrypoint.sh` script:

On Linux:
```
cd .. # go up to the root of this repository
docker run -e CARLA_SIM_IP -e CARLA_SIM_PORT --rm -it --platform linux/amd64 -p 9000:9000 --privileged -v /var/run/dbus:/var/run/dbus -v .:/workspaces/cycarla cycarla_server
```

Inside the container:
```
cd /workspaces/cycarla/cycarla-server
./entrypoint.sh
```