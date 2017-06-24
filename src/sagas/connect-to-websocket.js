import { eventChannel, END } from 'redux-saga'
import { takeLatest, take } from 'redux-saga/effects'
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
      // eslint-disable-next-line no-console
      console.log(message)
    }
  } finally {
    ws.disconnect()
  }
}

export default function* () {
  yield takeLatest(CONNECT_TO_WEBSOCKET, connectToWebsocket)
}
