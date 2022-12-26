# Hidden `appdata` directory

`bt_history.temp`: Every time a bluetooth device is paired, the device MAC address (XX:XX:XX:XX:XX:XX) is added to this file. This is used to unpair it from the system at the beginning of a new script run, because otherwise it will not show up on discover. Tested on Ubuntu 20.04.