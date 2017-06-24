import io from 'socket.io'
import uuid4 from 'uuid/v4'
import { afSetUsername, afUpdateUserList } from '../src/redux/actions.js'
import R from 'ramda'

const removeUser = (users, user) => {
  const idx = users.indexOf(user)
  if (idx > -1) {
    users.splice(idx, 1)
  }
}

const onDisconnect = (users, user) => () => {
  removeUser(users, user)
}

const broadcastAction = (users) => (action) => {
  users.forEach(({ws}) => ws.emit('action', action))
}

const updateUsername = (users, user) => (username) => {
  user.userId = username
  // TODO: there should be more complex logic here in the future to avoid duplicate userIds
  broadcastAction(users)(afUpdateUserList(
    users.map(R.prop('userId'))
  ))
}

const onConnect = (users) => (ws) => {
  const userId = uuid4(),
        user = {
          userId,
          ws,
        }
  users.push(user)

  ws.on('disconnect', onDisconnect(users, user))
  ws.on('client action', broadcastAction(users))
  ws.on('change username', updateUsername(users, user))

  broadcastAction(users)(afUpdateUserList(
    users.map(R.prop('userId'))
  ))
  ws.emit('message', 'Thanks for connecting via websockets')
  ws.emit('action', afSetUsername(userId))
}

const connect = (httpServer) => {
  const users = []
  const wss = io(httpServer)
  wss.on('connection', onConnect(users))
}

export default connect
