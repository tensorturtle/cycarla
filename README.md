# CyCARLA 0.2.0

Open World Cycling Simulator based on Unreal Engine and CARLA


`cycarla-controller` is a `create-next-app` project.

`cycarla-server` is a `poetry` project inside a `docker`.


## Installation

**CARLA 0.9.14**

**Docker**

```
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

```
docker pull carlasim/carla:0.9.14
```

**nodejs and npm**


## Quickstart

Run the following in each separate shell:

```
docker run --privileged --gpus all --net=host -e DISPLAY=$DISPLAY carlasim/carla:0.9.14 /bin/bash ./CarlaUE4.sh
```

```
cd cycarla-controller
npm run dev
```

```
cd cycarla-server
docker run --rm -it --network=host --privileged -v /var/run/dbus:/var/run/dbus -v .:/workspaces/cycarla/cycarla-server cycarla_server /workspaces/cycarla/cycarla-server/entrypoint.sh
```