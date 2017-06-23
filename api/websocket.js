import io from 'socket.io'
import uuid4 from 'uuid/v4'

const broadcast = (users, message) =>
  users.forEach(({ws}) => ws.emit('message', message))

const removeUser = (users, user) => {
  const idx = users.indexOf(user)
  if (idx > -1) {
    users.splice(idx, 1)
  }
}

const onDisconnect = (users, user) => () => {
  removeUser(users, user)
}

const onConnect = (users) => (ws) => {
  const userId = uuid4(),
        user = {
          userId,
          ws,
        }
  users.push(user)

  ws.on('disconnect', onDisconnect(users, user))

  broadcast(users, `New user: ${userId}`)
  ws.emit('message', 'Thanks for connecting via websockets')
}

const connect = (httpServer) => {
  const users = []
  const wss = io(httpServer)
  wss.on('connection', onConnect(users))

  setInterval(() => {
    broadcast(users, 'heartbeat')
  }, 1500)
}

export default connect
