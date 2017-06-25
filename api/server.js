import {
  createServer,
} from 'http'

import express from 'express'

import addRoutes from './routes.js'
import connect from './websocket.js'

const APP_PORT = 3003

const app = express()

// Add api routes
addRoutes(app)

const server = createServer(app)
connect(server)

// Serve static resources
/* import path from 'path'
 * app.use('/', express.static(path.resolve(__dirname, 'public')))*/

server.listen(APP_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App is now running at http://localhost:${APP_PORT}`)
})
