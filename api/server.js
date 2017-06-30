import path from 'path'
import {
  createServer,
} from 'http'

import express from 'express'

import {
  PORT,
  BASE_URL,
} from '../src/constants.js'

import {
  store,
} from './redux/index.js'
import {
  afConnectWebsocketServer,
} from './redux/actions.js'

const app = express()

const server = createServer(app)

// Connect websocket server
store.dispatch(afConnectWebsocketServer(server))

// Serve static resources
app.use('/', express.static(path.resolve(__dirname + '/../build/')))

server.listen(3003, () => {
  // eslint-disable-next-line no-console
  console.log(`App is now running at ${BASE_URL}:${PORT}`)
})
