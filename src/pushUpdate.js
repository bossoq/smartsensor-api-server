const fetch = require('node-fetch');
const password = require('./config.json').password;

const endpoint = 'http://10.0.1.244:8080';
const tempKey = 'CurrentTemperature';
const humidKey = 'CurrentRelativeHumidity';
const sensor1TempPath = '/living-room-temperature';
const sensor2TempPath = '/bedroom-temperature';
const sensor1HumidPath = '/living-room-humidity';
const sensor2HumidPath = '/bedroom-humidity';

module.exports = async (name, type, value) => {
  let url = endpoint;
  let key;
  if (type === 'TEMP') {
    key = tempKey;
    if (name === 'sensor1') {
      url += sensor1TempPath;
    } else if (name === 'sensor2') {
      url += sensor2TempPath;
    }
  } else if (type === 'HUMID') {
    key = humidKey;
    if (name === 'sensor1') {
      url += sensor1HumidPath;
    } else if (name === 'sensor2') {
      url += sensor2HumidPath;
    }
  }
  const body = JSON.stringify({
    characteristic: key,
    value: value,
    password
  });
  const options = {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  await fetch(url, options);
};
