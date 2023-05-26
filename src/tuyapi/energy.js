const TuyAPI = require('tuyapi');
const pushUpdate = require('../pushUpdate');

module.exports = class Sensor {
  constructor(sensor) {
    this.name = sensor.name;
    this.id = sensor.id;
    this.key = sensor.key;
    this.ip = sensor.ip;
    this.AddElec = 0;
    this.Current = 0;
    this.Power = 0;
    this.Voltage = 0;
    this.device = new TuyAPI({
      id: this.id,
      key: this.key,
      ip: this.ip,
      version: '3.3',
      issueRefreshOnConnect: true
    });

    let stateHasChanged = false;

    this.device.find().then(() => {
      this.device.connect();
    });

    this.device.on('connected', () => {
      console.log(`Connected to device! ${this.name}`);
    });

    this.device.on('disconnected', () => {
      console.log(`Disconnected from device ${this.name}.`);
      this._reconnect();
    });

    this.device.on('error', (error) => {
      console.log('Error!', error);
      this._reconnect();
    });

    this.device.on('dp-refresh', (data) => {
      Object.entries(parseData(data)).forEach(([key, value]) => {
        this[key] = value;
        if (key === 'AddElec') {
          pushUpdate('AddElec', value, 'kWh');
        } else if (key === 'Current') {
          pushUpdate('Current', value, 'A');
        } else if (key === 'Power') {
          pushUpdate('Power', value, 'W');
        } else if (key === 'Voltage') {
          pushUpdate('Voltage', value, 'V');
        }
      });
    });

    this.device.on('data', (data) => {
      Object.entries(parseData(data)).forEach(([key, value]) => {
        this[key] = value;
        if (key === 'AddElec') {
          pushUpdate('AddElec', value, 'kWh');
        } else if (key === 'Current') {
          pushUpdate('Current', value, 'A');
        } else if (key === 'Power') {
          pushUpdate('Power', value, 'W');
        } else if (key === 'Voltage') {
          pushUpdate('Voltage', value, 'V');
        }
      });

      if (!stateHasChanged) {
        this.device.set({ set: !data.dps['1'] });
        stateHasChanged = true;
      }
    });
  }
  _reconnect() {
    setTimeout(() => {
      this.device.find().then(() => {
        this.device.connect();
      });
    }, 5000);
  }
  get addElec() {
    return this.AddElec;
  }
  get current() {
    return this.Current;
  }
  get power() {
    return this.Power;
  }
  get voltage() {
    return this.Voltage;
  }
};

const parseData = (data) => {
  const parsedData = {};

  Object.entries(data.dps).forEach(([key, value]) => {
    switch (key) {
      case '17':
        parsedData.AddElec = value / 1000;
        break;
      case '18':
        parsedData.Current = value / 1000;
        break;
      case '19':
        parsedData.Power = value / 10;
        break;
      case '20':
        parsedData.Voltage = value / 10;
        break;
      default:
        break;
    }
  });

  return parsedData;
};
