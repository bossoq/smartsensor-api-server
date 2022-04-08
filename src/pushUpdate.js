const fetch = require('node-fetch');
const password = require('./config.json').password;

const endpoint = process.env.ENDPOINT || 'http://10.0.4.3:8080';
const tempKey = 'CurrentTemperature';
const humidKey = 'CurrentRelativeHumidity';
const aqiKey = 'AirQuality';
const pm10Key = 'PM10Density';
const pm25Key = 'PM2_5Density';
const sensor1TempPath = '/living-room-temperature';
const sensor2TempPath = '/bed-room-temperature';
const sensor1HumidPath = '/living-room-humidity';
const sensor2HumidPath = '/bed-room-humidity';
const sensor1AQIPath = '/living-room-aqi';
// const sensor1PM10Path = '/living-room-pm10';
// const sensor1PM25Path = '/living-room-pm25';

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
  } else if (type === 'AQI') {
    key = aqiKey;
    url += sensor1AQIPath;
  } else if (type === 'PM10') {
    key = pm10Key;
    url += sensor1AQIPath;
  } else if (type === 'PM25') {
    key = pm25Key;
    url += sensor1AQIPath;
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
  try {
    await fetch(url, options);
  } catch (err) {
    console.error(`Could not update ${name} ${type} to ${value} with ${err}`);
  }
};
