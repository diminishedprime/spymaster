import io from 'socket.io'
import uuid4 from 'uuid/v4'
import {
  afSetUsername,
  afUpdateRemoteState,
  afAddUser,
  afRemoveUser,
  afUpdateUsername,
} from '../src/redux/actions.js'
import R from 'ramda'
import paths from '../src/redux/paths.js'
import { store } from './redux/index.js'

const onDisconnect = (user) => () => {
  store.dispatch(afRemoveUser(user))
}

const forceUpdateRemoteState = () => {
  const users = R.view(paths.usersPath, store.getState())
  const remoteStateAction = afUpdateRemoteState(
    R.view(paths.remoteStatePath, store.getState())
  )
  users.forEach(({ws}) => ws.emit('action', remoteStateAction))
}

const broadcastAction = (action) => {
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
