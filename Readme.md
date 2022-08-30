# TODO
- [ ] Add a setup guide
- [x] Re-publishing sensors if the configuration has NOT changed is a bad idea. The old device is dropped & a duplicate
  one is created. This results in a lot of duplicated entities.
  - We can address this by subscribing to the sensors configuration topic(s) and only publish the topic if...
    1. Configuration doesn't exist
    2. Configuration != current configuration
- [ ] Use published MQTT data to configure the 'name' of current sensors, so that changes to various names don't trigger
      a republish of the configuration.
- [X] Add a basic 'statistics' page // request response
  - [ ] Add a basic 'statistics' view
- [ ] Add proper error logging for diagnosing unexpected problems.
- [ ] Remove Acuparse dependency, and allow this to directly aggregate sensor data.
  - Benefits of doing this include
    - Allow multiple smart-hubs to report their data directly to this
    - Could switch Acuparse to pulling in data from my 'Access' hub, which has a more reliable connection w/ my 5-in-1 
      sensor
  - Drawbacks:
    - SmartHubs don't work w/ the new 'Atlas' sensors
  - [ ] Add a frontend to display current sensor data (Home Assistant?)
  - [ ] Create a way to specify the names of sensors (since Acuparse is used for that now)