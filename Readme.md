# TODO
* Pull down tower names from Acuparse API, map them to received tower IDs
  * This needs to happen on a schedule (every 5 minutes?) so that changes in Acuparse are reflected here.
* Add a setup guide


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

## 5-in-1 (temperature)
All from tower
- Windspeed

## 5-in-1 (wind)
- Temperature
- Humidity
- Battery
- Signal
- timestamp