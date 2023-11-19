#!/bin/bash
export CARLA_SIM_IP=172.30.1.43
export CARLA_SIM_PORT=2000

# Get the kernel name, trimming any potential whitespace
os=$(uname -s | tr -d ' ')

# Check the kernel name
case "$os" in
    Linux*)
        echo "Linux"
        docker run -e CARLA_SIM_IP -e CARLA_SIM_PORT --rm -it --platform linux/amd64 -p 9000:9000 --privileged -v /var/run/dbus:/var/run/dbus -v .:/workspaces/cycarla cycarla_server /workspaces/cycarla/cycarla-server/entrypoint.sh
        ;;
    Darwin*)
        echo "macOS"
        docker run -e CARLA_SIM_IP -e CARLA_SIM_PORT --rm -it --platform linux/amd64 -p 9000:9000 --privileged -v $(pwd):/workspaces/cycarla cycarla_server /workspaces/cycarla/cycarla-server/entrypoint.sh
        ;;
    *)
        echo "Unknown operating system"
        ;;
esac
