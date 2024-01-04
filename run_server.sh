#!/bin/bash

if [ -z "$CARLA_SIM_IP" ]; then
    echo "CARLA_SIM_IP environment variable not set. Using default localhost."
    export CARLA_SIM_IP=127.0.0.1
fi

if [ -z "$CARLA_SIM_PORT" ]; then
    echo "CARLA_SIM_PORT environment variable not set. Using default port 2000."
    export CARLA_SIM_PORT=2000
fi

os=$(uname -s | tr -d ' ')

case "$os" in
    Linux*)
        echo "Detected OS: Linux"
        #docker run -e CARLA_SIM_IP -e CARLA_SIM_PORT --rm -it --platform linux/amd64 --network host --privileged -v /var/run/dbus:/var/run/dbus -v .:/workspaces/cycarla cycarla_server /workspaces/cycarla/cycarla-server/entrypoint.sh
        docker run -e CARLA_SIM_IP -e CARLA_SIM_PORT --rm -it --platform linux/amd64 -p 9000:9000 -p 2000:2000 --privileged -v /var/run/dbus:/var/run/dbus -v .:/workspaces/cycarla cycarla_server /workspaces/cycarla/cycarla-server/entrypoint.sh
        # specify ports instead of network=host for WSL2 compatibility
        ;;
    Darwin*)
        echo "Detected OS: macOS. macOS is not supported because CARLA simulator cannot run on macOS, and this server requires a high-bandwidth, low-latency localhost connection to the CARLA simulator."
        echo "Exiting."
        #docker run -e CARLA_SIM_IP -e CARLA_SIM_PORT --rm -it --platform linux/amd64 -p 9000:9000 --privileged -v $(pwd):/workspaces/cycarla cycarla_server /workspaces/cycarla/cycarla-server/entrypoint.sh
        ;;
    *)
        echo "Unknown operating system"
        ;;
esac
