import {
  eventChannel,
  END,
} from 'redux-saga'
import io from 'socket.io-client'
import R from 'ramda'

import {
  afSetWs,
  afListenToWebsocket,
  CONNECT_TO_WEBSOCKET,
  LISTEN_TO_WEBSOCKET,
  EMIT_ACTION,
} from '../actions.js'
import {
  gameIdPath,
  wsPath,
} from '../paths.js'
import {
  PORT,
  BASE_URL,
} from '../../constants.js'

import {
  takeLatest,
  take,
  put,
  select,
  takeEvery,
} from 'redux-saga/effects'

const emitAction = function* ({action}) {
  const ws = yield select((state) => R.view(wsPath, state))
  const gameId = yield select(R.view(gameIdPath))
  ws.emit('client action', {...action, gameId})
}

const listenToWebsocket = function* () {
  const ws = yield select((state) => R.view(wsPath, state))

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
  const url = BASE_URL + ':' + PORT
  const ws = yield io.connect(url)
  yield put(afSetWs(ws))
  yield put(afListenToWebsocket())
}

export default function* () {
  yield takeLatest(CONNECT_TO_WEBSOCKET, connectToWebsocket)
  yield takeLatest(LISTEN_TO_WEBSOCKET, listenToWebsocket)
  yield takeEvery(EMIT_ACTION, emitAction)
}
