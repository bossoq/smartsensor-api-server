import config from '../config.json'
const energy = require('./energy')

export const energySensor = new energy(config.energy)
