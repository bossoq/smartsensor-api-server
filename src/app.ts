import express from 'express'
import { sensor1, sensor2 } from './tuyapi/init'

const app = express()
const port = process.env.PORT || 3000

app.get('/api/getTemperature1', (req, res) => {
  res.send(sensor1.temperature.toString())
})
app.get('/api/getTemperature2', (req, res) => {
  res.send(sensor2.temperature.toString())
})
app.get('/api/getHumidity1', (req, res) => {
  res.send(sensor1.humidity.toString())
})
app.get('/api/getHumidity2', (req, res) => {
  res.send(sensor1.humidity.toString())
})
app.get('/api/getAQI', (req, res) => {
  res.send(sensor1.aqi.toString())
})
app.get('/api/getPM10', (req, res) => {
  res.send(sensor1.pm10.toString())
})
app.get('/api/getPM25', (req, res) => {
  res.send(sensor1.pm25.toString())
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
