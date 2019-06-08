import * as path from 'path'
import * as fs from 'fs'
import {
  createServer,
} from 'http'

import express = require('express')

import {
  PORT,
  BASE_URL,
} from '../src/constants'

import {
  store,
} from './redux/index'
import {
  afConnectWebsocketServer,
} from './redux/actions'

// const options = {
//   key: fs.readFileSync('/etc/letsencrypt/live/spymaster.mjh.io/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/spymaster.mjh.io/cert.pem'),
// }

const app = express()

const server = createServer(app)

// Connect websocket server
store.dispatch(afConnectWebsocketServer(server))

// Serve static resources
app.use('/', express.static(path.resolve(__dirname + '/../build/')))

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App is now running at ${BASE_URL}:${PORT}`)
})
