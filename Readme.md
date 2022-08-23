# TODO
- [ ] Add a setup guide
- [x] Re-publishing sensors if the configuration has NOT changed is a bad idea. The old device is dropped & a duplicate
  one is created. This results in a lot of duplicated entities.
  - We can address this by subscribing to the sensors configuration topic(s) and only publish the topic if...
    1. Configuration doesn't exist
    2. Configuration != current configuration
- [ ] Use published MQTT data to configure the 'name' of current sensors, so that changes to various names don't trigger
      a republish of the configuration.
- [ ] Add a basic 'statistics' page // request response