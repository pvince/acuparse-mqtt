# TODO
- [ ] Add a setup guide
- [ ] Re-publishing sensors if the configuration has NOT changed is a bad idea. The old device is dropped & a duplicate
  one is created. This results in a lot of duplicated entities.
  - We can address this by subscribing to the sensors configuration topic(s) and only publish the topic if...
    1. Configuration doesn't exist
    2. Configuration != current configuration
- [ ] Add a basic 'statistics' page // request response