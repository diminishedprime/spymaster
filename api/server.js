import path from 'path'
import {
  createServer,
} from 'http'

import express from 'express'

import {
  PORT,
  BASE_URL,
} from '../src/constants.js'

import addRoutes from './routes.js'
import connect from './websocket.js'

const app = express()

// Add api routes
addRoutes(app)

const server = createServer(app)
connect(server)

// Serve static resources
app.use('/', express.static(path.resolve(__dirname + '/../build/')))

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App is now running at ${BASE_URL}:${PORT}`)
})
