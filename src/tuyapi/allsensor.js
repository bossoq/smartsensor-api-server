const TuyAPI = require('tuyapi');
const pushUpdate = require('../pushUpdate');

module.exports = class Sensor {
  constructor(sensor) {
    this.name = sensor.name;
    this.id = sensor.id;
    this.key = sensor.key;
    this.ip = sensor.ip;
    this.PM10 = 0;
    this.PM25 = 0;
    this.PM1 = 0;
    this.TEMP = 0;
    this.HUMID = 0;
    const device = new TuyAPI({
      id: this.id,
      key: this.key,
      ip: this.ip,
      version: '3.3',
      issueRefreshOnConnect: true
    });

    let stateHasChanged = false;

    device.find().then(() => {
      device.connect();
    });

    device.on('connected', () => {
      console.log(`Connected to device! ${this.name}`);
    });

    device.on('disconnected', () => {
      console.log(`Disconnected from device ${this.name}.`);
      setTimeout(() => {
        device.find().then(() => {
          device.connect();
        });
      }, 5000);
    });

    device.on('error', (error) => {
      console.log('Error!', error);
    });

    device.on('dp-refresh', (data) => {
      Object.entries(parseData(data)).forEach(([key, value]) => {
        this[key] = value;
        if (key === 'TEMP') {
          pushUpdate(this.name, 'TEMP', value);
        } else if (key === 'HUMID') {
          pushUpdate(this.name, 'HUMID', value);
        }
      });
    });

    device.on('data', (data) => {
      Object.entries(parseData(data)).forEach(([key, value]) => {
        this[key] = value;
      });

      if (!stateHasChanged) {
        device.set({ set: !data.dps['1'] });
        stateHasChanged = true;
      }
    });
  }
  get pm10() {
    return this.PM10;
  }
  get pm25() {
    return this.PM25;
  }
  get pm1() {
    return this.PM1;
  }
  get temperature() {
    return this.TEMP;
  }
  get humidity() {
    return this.HUMID;
  }
};

const parseData = (data) => {
  const parsedData = {};

  Object.entries(data.dps).forEach(([key, value]) => {
    switch (key) {
      case '101':
        parsedData.PM10 = value;
        break;
      case '102':
        parsedData.PM25 = value;
        break;
      case '103':
        parsedData.PM1 = value;
        break;
      case '104':
        parsedData.TEMP = value * 0.1;
        break;
      case '105':
        parsedData.HUMID = value;
        break;
      default:
        break;
    }
  });

  return parsedData;
};
