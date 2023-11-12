# CyCARLA 2.0

`cycarla-controller` is a `create-react-app` project.

`cycarla-server` is a `poetry` project inside a `docker`.

# CyCARLA

Open World Cycling Simulator based on Unreal Engine and CARLA

## Installation

CyCARLA requires

+ CARLA 0.9.14
+ Poetry
+ Python 3.8 (`carla` Python client supports up to 3.8)
+ Docker (to run CARLA)

Install Docker
```
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

Pull CARLA image

```
docker pull carlasim/carla:0.9.14
```

Install Poetry

```
curl -sSL https://install.python-poetry.org | python3 -
```

Install Python 3.8, so that `python3.8` starts the python interpreter.

## Launch Carla

```
sudo docker run --privileged --gpus all --net=host -e DISPLAY=$DISPLAY carlasim/carla:0.9.14 /bin/bash ./CarlaUE4.sh
```

## Launch App

From the repository root, run:
```
poetry shell
```
Navigate to package:
```
cd cycarla
```
Run Terminal UI app:
```
python3 app.py
```

