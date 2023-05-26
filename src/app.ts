import express from 'express'
import { energySensor } from './tuyapi/init'

const app = express()
const port = process.env.PORT || 3000

app.get('/api/getAddElec', (req, res) => {
  res.send(energySensor.addElec.toString())
})
app.get('/api/getCurrent', (req, res) => {
  res.send(energySensor.current.toString())
})
app.get('/api/getPower', (req, res) => {
  res.send(energySensor.power.toString())
})
app.get('/api/getVoltage', (req, res) => {
  res.send(energySensor.voltage.toString())
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
