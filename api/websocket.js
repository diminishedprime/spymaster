import io from 'socket.io'
import uuid4 from 'uuid/v4'
import R from 'ramda'

import {
  NEW_GAME,
  afSetGameMode,
  afSetUsername,
  afUpdateRemoteState,
  afAddUser,
  afRemoveUser,
  afUpdateUsername,
} from '../src/redux/actions.js'
import {
  remoteStatePath,
  usersPath,
} from '../src/redux/paths.js'
import {
  GAME_MODE_PICK_TEAM,
} from '../src/constants.js'

import {
  store,
} from './redux/index.js'

const onDisconnect = (user) => () => {
  store.dispatch(afRemoveUser(user))
}

export const forceUpdateRemoteState = () => {
  const users = R.view(usersPath, store.getState())
  const remoteStateAction = afUpdateRemoteState(
    R.view(remoteStatePath, store.getState())
  )
  users.forEach(({ws}) => ws.emit('action', remoteStateAction))
}

const broadcastAction = (action) => {
  /* For some actions, we want to change clients local state. It would be better
     if this was done in a saga instead of adhocly here.*/
  if (action.type === NEW_GAME) {
    const users = R.view(usersPath, store.getState())
    users.forEach(({ws}) => ws.emit('action', afSetGameMode(GAME_MODE_PICK_TEAM)))
  }
  store.dispatch(action)
  forceUpdateRemoteState()
}

const updateUsername = (user) => (username) => {
  store.dispatch(afUpdateUsername(user, username))
  forceUpdateRemoteState()
}

const addUser = (user) => {
  store.dispatch(afAddUser(user))
  forceUpdateRemoteState()
}

const onConnect = (ws) => {
  const userId = uuid4().substring(0, 8),
        user = {
          userId,
          ws,
        }

  ws.on('disconnect', onDisconnect(user))
  ws.on('client action', broadcastAction)
  ws.on('change username', updateUsername(user))
  ws.emit('message', 'Thanks for connecting via websockets')
  ws.emit('action', afSetUsername(userId))
  addUser(user)
}

const connect = (httpServer) => {
  const wss = io(httpServer)
  wss.on('connection', onConnect)
}

export default connect
