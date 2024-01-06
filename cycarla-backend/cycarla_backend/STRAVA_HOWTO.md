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
