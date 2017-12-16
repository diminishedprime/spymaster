import {
  eventChannel,
  END,
} from 'redux-saga'
import io from 'socket.io-client'
import R from 'ramda'

import {
  afSetWs,
  afListenToWebsocket,
  afSetConnected,
  LISTEN_TO_WEBSOCKET,
  EMIT_ACTION,
  CONNECT_TO_SERVER,
} from '../actions.js'
import {
  gameIdPath,
  userIdPath,
  wsPath,
} from '../paths.js'

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
  const userId = yield select(R.view(userIdPath))
  if (gameId) {
    action = R.assoc('gameId', gameId, action)
  }
  if (userId) {
    action = R.assoc('userId', userId, action)
  }
  ws.emit('client action', action)
}

const listenToWebsocket = function* () {
  const ws = yield select((state) => R.view(wsPath, state))

  const wsChan = eventChannel((emitter) => {
    ws.on('message', (message) => emitter({message}))
    ws.on('action', (action) => emitter({action}))
    ws.on('disconnect', () => emitter({disconnect: true}) && emitter(END))
    return () => ws.disconnect()
  })

  try {
    for (;;) {
      const {message, action, disconnect} = yield take(wsChan)
      if (action) {
        yield put(action)
      }
      if (message) {
        // Currently, a message is sent letting the client know they are
        // connected.
        yield put(afSetConnected(true))
        // eslint-disable-next-line no-console
        console.log(message)
      }
      if (disconnect) {
        yield put(afSetConnected(false))
      }
    }
  } finally {
    ws.disconnect()
  }
}

const connectToServer = function* ({serverAddress}) {
  const ws = yield io.connect(serverAddress)
  yield put(afSetWs(ws))
  yield put(afListenToWebsocket())
}

export default function* () {
  yield takeLatest(CONNECT_TO_SERVER, connectToServer)
  yield takeLatest(LISTEN_TO_WEBSOCKET, listenToWebsocket)
  yield takeEvery(EMIT_ACTION, emitAction)
}
