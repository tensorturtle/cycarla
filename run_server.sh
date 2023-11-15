cd cycarla-server
docker run --rm -it --network=host --privileged -v /var/run/dbus:/var/run/dbus -v .:/workspaces/cycarla/cycarla-server cycarla_server /workspaces/cycarla/cycarla-server/entrypoint.sh
