import config from '../config.json'
const allsensor = require('./allsensor')
const temphumid = require('./temphumid')

export const sensor1 = new allsensor(config.sensor1)
export const sensor2 = new temphumid(config.sensor2)
