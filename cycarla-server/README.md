# Develop

+ Install `Dev Containers` VSCode extension.
+ Click on Docker logo on the left toolbar of VSCode
+ Next to `CONTAINERS`, press the '+' button.
+ Select "Open Folder in Container"
+ Select "cycarla-server"
+ When prompted, "Use Existing Dockerfile" within this directory.
+ `./entrypoint.sh`


# Build / Deploy

From this directory,

```
docker build -t cycarla_server . 
```

The `entrypoint.sh` script contains what to run at deploy.
```
docker run --rm -it --network=host --privileged -v /var/run/dbus:/var/run/dbus -v .:/workspaces/cycarla/cycarla-server cycarla_server /workspaces/cycarla/cycarla-server/entrypoint.sh
```
