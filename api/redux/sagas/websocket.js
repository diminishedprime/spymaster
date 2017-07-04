import uuid4 from 'uuid/v4'
import R from 'ramda'
import io from 'socket.io'
import {
  eventChannel,
} from 'redux-saga'

import {
  MESSAGE,
  ACTION,
} from '../../../src/constants.js'
import {
  wsByUserIdPath,
  usersPath,
} from '../paths.js'
import {
  CONNECT_WEBSOCKET_SERVER,
  BROADCAST_MESSAGE_TO_USER_IDS,
  BROADCAST_MESSAGE_TO_USER_ID,
  BROADCAST_MESSAGE_TO_ALL,
  BROADCAST_ACTION_TO_USER_IDS,
  BROADCAST_ACTION_TO_USER_ID,
  BROADCAST_ACTION_TO_ALL,
  afAddUser,
  afRemoveUser,
  afBroadcastMessageToUserId,
  afUserConnected,
} from '../actions.js'

import {
  fork,
  put,
  take,
  all,
  select,
  takeEvery,
} from 'redux-saga/effects'

const broadcastMessageToUserId = function* () {
  yield takeEvery(BROADCAST_MESSAGE_TO_USER_ID, function* ({userId, message}) {
    const ws = yield select(R.view(wsByUserIdPath(userId)))
    ws.emit(MESSAGE, message)
  })
}
const broadcastMessageToUserIds = function* () {
  yield takeEvery(BROADCAST_MESSAGE_TO_USER_IDS, function* ({userIds, message}) {
    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i]
      const ws = yield select(R.view(wsByUserIdPath(userId)))
      ws.emit(MESSAGE, message)
    }
  })
}
const broadcastMessageToAll = function* () {
  yield takeEvery(BROADCAST_MESSAGE_TO_ALL, function* ({message}) {
    const userIds = yield select(R.compose(R.keys, R.view(usersPath)))
    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i]
      const ws = yield select(R.view(wsByUserIdPath(userId)))
      ws.emit(MESSAGE, message)
    }
  })
}
const broadcastActionToUserId = function* () {
  yield takeEvery(BROADCAST_ACTION_TO_USER_ID, function* ({userId, action}) {
    const ws = yield select(R.view(wsByUserIdPath(userId)))
    ws.emit(ACTION, action)
  })
}
const broadcastActionToUserIds = function* () {
  yield takeEvery(BROADCAST_ACTION_TO_USER_IDS, function* ({userIds, action}) {
    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i]
      const ws = yield select(R.view(wsByUserIdPath(userId)))
      ws.emit(ACTION, action)
    }
  })
}
const broadcastActionToAll = function* () {
  yield takeEvery(BROADCAST_ACTION_TO_ALL, function* ({action}) {
    const userIds = yield select(R.compose(R.keys, R.view(usersPath)))
    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i]
      const ws = yield select(R.view(wsByUserIdPath(userId)))
      ws.emit(ACTION, action)
    }
  })
}

const onDisconnect = function* (wsChan) {
  const userId = yield take(wsChan)
  yield (put(afRemoveUser(userId)))
}

const onClientAction = function* (wsChan) {
  let action
  while ((action = yield take(wsChan))) {
    yield put(action)
  }
}

const connectWS = function* (ws) {
  // eslint-disable-next-line
  const userId = uuid4()

  const clientActionChan = eventChannel((emitter) => {
    ws.on('client action', emitter)
    // eslint-disable-next-line no-console
    return () => console.log('something unsubscribe socket')
  })

  const disconnectChan = eventChannel((emitter) => {
    ws.on('disconnect', () => emitter(userId))
    // eslint-disable-next-line no-console
    return () => console.log('something unsubscribe socket')
  })

  yield put(afAddUser(userId, ws))
  yield put(afBroadcastMessageToUserId(
    userId,
    'thanks for connecting via websockets'))
  yield put(afUserConnected(userId))
  yield fork(onClientAction, clientActionChan)
  yield onDisconnect(disconnectChan)

}

const connectWSS = function* () {
  const { httpServer } = yield take(CONNECT_WEBSOCKET_SERVER)
  const wss = io(httpServer)
  const wssConnectionChan = eventChannel((emitter) => {
    wss.on('connection', (ws) => emitter(ws))
    // eslint-disable-next-line no-console
    return () => console.log('something unsubscribe from wss emitter?')
  })
  let ws
  while ((ws = yield take(wssConnectionChan))) {
    yield fork(connectWS, ws)
  }
}

const websocket = function* () {
  yield all([
    broadcastMessageToUserIds(),
    broadcastMessageToUserId(),
    broadcastMessageToAll(),
    broadcastActionToUserIds(),
    broadcastActionToUserId(),
    broadcastActionToAll(),
    connectWSS(),
  ])
}

export default websocket
