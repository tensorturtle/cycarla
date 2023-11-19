cd cycarla-server
export CARLA_SIM_IP=127.0.0.1
export CARLA_SIM_PORT=2000
docker run -e CARLA_SIM_IP -e CARLA_SIM_PORT --rm -it --network=host --privileged -v /var/run/dbus:/var/run/dbus -v .:/workspaces/cycarla/cycarla-server cycarla_server /workspaces/cycarla/cycarla-server/entrypoint.sh