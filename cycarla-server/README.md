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

# Uploading to Strava

This is a very rough demo of authenticating and uploading GPX files to Strava. It is not incorporated into cycarla at all at this point.

Reminder: The uploaded file should be owned by the user, not sudo.
`sudo chown username DEMO.gpx` otherwise.

See `gpx_demo.py` for an equally rough, unincorporated proof of concept of creating GPX files.

## Set up Strava API

Create an API Application.

Get client ID. In my case, `119241`

## Set up Cycarla (Client)

https://developers.strava.com/docs/authentication/

### Requesting Access

https://developers.strava.com/docs/authentication/#detailsaboutrequestingaccess

Fill in client ID like so, and go to this address on a web browser.
```
https://www.strava.com/oauth/authorize?client_id=119241&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=activity:write
```
This asks for write access for activities.

The resulting empty page has a URL that contains `code=`, such as:
`7d2826e1e678870684bec2d405fbfadbd9f11487` (not valid code but should look similar)

In production, I think the callback URL should parse this and continue. For now we literally copy paste it from the URL.

### Token Exchange

Use the `code=` string and other info from your API page to send:
```
curl -X POST https://www.strava.com/api/v3/oauth/token \
  -d client_id=ReplaceWithClientID \
  -d client_secret=ReplaceWithClientSecret \
  -d code=ReplaceWithCode \
  -d grant_type=authorization_code
```

Which provides you with `access_token` somewhere within the JSON.

### Uploading GPX file

Finally, upload the .gpx file using `access_token` as the Bearer authorization.
```
curl -X POST https://www.strava.com/api/v3/uploads \                                                  
    -H "Authorization: Bearer fc5f6edef83b8fa0221ba31fd4e83a28045a1f9e" \
    -F activity_type="VirtualRide" \
    -F name="Test Walk" \
    -F description="Test description" \
    -F trainer=0 \
    -F commute=0 \
    -F data_type="gpx" \
    -F external_id="98765" \
    -F file=@outputfromdemo.gpx
```