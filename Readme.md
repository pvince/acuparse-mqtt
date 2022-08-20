# TODO
* Translate to better JSON (strings to numbers, dateutc to date last updated)
* Setup a reporting loop that triggers every minute. Aggregate data to publish.
* Pull down tower names from Acuparse API, map them to received tower IDs


# Converting to HomeAssistant discovery
## Tower Sensors
Data to report:
- Temperature
- Humidity
- Battery level
- Last update
- Signal Strength (rssi)

## ProIn Sensors
All from tower
- water

##