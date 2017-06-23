import { eventChannel, END } from 'redux-saga'
import { takeLatest, take, put } from 'redux-saga/effects'
import { afIncrementHeartbeats } from '../redux.js'
import io from 'socket.io-client'

export const CONNECT_TO_WEBSOCKET = 'async connect to websocket'
export const afConnectToWebsocket = () => ({
  type: CONNECT_TO_WEBSOCKET,
})

const connectToWebsocket = function* () {
  const ws = yield io.connect('http://localhost:3000')

  const wsChan = eventChannel((emitter) => {
    ws.on('message', emitter)
    ws.on('disconnect', () => emitter(END))
    return () => ws.disconnect()
  })

  try {
    for (;;) {
      const message = yield take(wsChan)
      if (message === 'heartbeat') {
        yield put(afIncrementHeartbeats())
      }
    }
  } finally {
    ws.disconnect()
  }
}

export default function* () {
  yield takeLatest(CONNECT_TO_WEBSOCKET, connectToWebsocket)
}
