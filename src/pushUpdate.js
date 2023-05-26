const fetch = require('node-fetch');
const apiKey = require('./config.json').apiKey;

const endpoint =
  process.env.ENDPOINT || 'http://10.0.6.1:8123/api/states/sensor.';
const addElecKey = 'Energy';
const currentKey = 'Current';
const powerKey = 'Power';
const voltageKey = 'Voltage';
const addElecPath = 'ev_energy_meter_addelec';
const currentPath = 'ev_energy_meter_current';
const powerPath = 'ev_energy_meter_power';
const voltagePath = 'ev_energy_meter_voltage';
const addElecName = 'EV Energy Meter Add Elec';
const currentName = 'EV Energy Meter Current';
const powerName = 'EV Energy Meter Power';
const voltageName = 'EV Energy Meter Voltage';

module.exports = async (type, value, unit) => {
  let url = endpoint;
  let key;
  let friendlyName;
  if (type === 'AddElec') {
    url += addElecPath;
    key = addElecKey;
    friendlyName = addElecName;
  } else if (type === 'Current') {
    url += currentPath;
    key = currentKey;
    friendlyName = currentName;
  } else if (type === 'Power') {
    url += powerPath;
    key = powerKey;
    friendlyName = powerName;
  } else if (type === 'Voltage') {
    url += voltagePath;
    key = voltageKey;
    friendlyName = voltageName;
  }
  const body = JSON.stringify({
    state: value,
    attributes: {
      unit_of_measurement: unit,
      friendly_name: friendlyName,
      device_class: key
    }
  });
  const options = {
    method: 'POST',
    body,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  };
  try {
    await fetch(url, options);
  } catch (err) {
    console.error(
      `Could not update ${friendlyName} ${type} to ${value} with ${err}`
    );
  }
};
