import { eventChannel, END } from 'redux-saga'
import { takeLatest, take, put, select, takeEvery } from 'redux-saga/effects'
import io from 'socket.io-client'
import { afSetWs } from '../redux/actions.js'
import R from 'ramda'
import paths from '../redux/paths.js'

export const SET_SERVER_USERNAME = 'async set server username'
export const afSetServerUsername = () => ({
  type: SET_SERVER_USERNAME,
})

export const CONNECT_TO_WEBSOCKET = 'async connect to websocket'
export const afConnectToWebsocket = () => ({
  type: CONNECT_TO_WEBSOCKET,
})

export const LISTEN_TO_WEBSOCKET = 'async listen to websocket'
export const afListenToWebsocket = () => ({
  type: LISTEN_TO_WEBSOCKET,
})

export const EMIT_ACTION = 'async emit'
export const afEmitAction = (action) => ({
  type: EMIT_ACTION,
  action,
})

const emitSetServerUsername = function* () {
  const username = yield select((state) => R.view(paths.usernamePath, state))
  const ws = yield select((state) => R.view(paths.wsPath, state))
  ws.emit('change username', username)
}

const emitAction = function* ({action}) {
  const ws = yield select((state) => R.view(paths.wsPath, state))
  ws.emit('client action', action)
}

const listenToWebsocket = function* () {
  const ws = yield select((state) => R.view(paths.wsPath, state))

  const wsChan = eventChannel((emitter) => {
    ws.on('message', (message) => emitter({message}))
    ws.on('action', (action) => emitter({action}))
    ws.on('disconnect', () => emitter(END))
    return () => ws.disconnect()
  })

  try {
    for (;;) {
      const {message, action} = yield take(wsChan)
      if (action) {
        yield put(action)
      }
      if (message) {
        // eslint-disable-next-line no-console
        console.log(message)
      }
    }
  } finally {
    ws.disconnect()
  }
}

const connectToWebsocket = function* () {
  const ws = yield io.connect('http://localhost:3000')
  yield put(afSetWs(ws))
  yield put(afListenToWebsocket())
}

export default function* () {
  yield takeLatest(CONNECT_TO_WEBSOCKET, connectToWebsocket)
  yield takeLatest(LISTEN_TO_WEBSOCKET, listenToWebsocket)
  yield takeEvery(EMIT_ACTION, emitAction)
  yield takeEvery(SET_SERVER_USERNAME, emitSetServerUsername)
}
