const NodeGeoCoder = require('node-geocoder');

const options = {
  provider: 'mapquest',
  httpAdapter: 'https',
  apiKey: 'mCJoRh32tZyOvICqUwvca7qTAeMN5DPo',
  formatter: null
};

const geocoder = NodeGeoCoder(options);

module.exports = geocoder;
