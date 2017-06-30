export const ADD_USER = 'new user'
export const afAddUser = (userId, ws) => ({
  type: ADD_USER,
  ws,
  userId,
})

export const REMOVE_USER = 'remove user'
export const afRemoveUser = (userId) => ({
  type: REMOVE_USER,
  userId,
})

// Async actions
const asyncConst = (val) => 'async' + val

export const CONNECT_WEBSOCKET_SERVER = asyncConst('connect websocket server')
export const afConnectWebsocketServer = (httpServer) => ({
  type: CONNECT_WEBSOCKET_SERVER,
  httpServer,
})

export const BROADCAST_MESSAGE_TO_USER_ID = asyncConst('message user id')
export const afBroadcastMessageToUserId = (userId, message) => ({
  type: BROADCAST_MESSAGE_TO_USER_ID,
  userId,
  message,
})
export const BROADCAST_MESSAGE_TO_USER_IDS = asyncConst('message user ids')
export const afBroadcastMessageToUserIds = (userIds, message) => ({
  type: BROADCAST_MESSAGE_TO_USER_IDS,
  userIds,
  message,
})
export const BROADCAST_MESSAGE_TO_ALL = asyncConst('message all')
export const afBroadcastMessageToAll = (message) => ({
  type: BROADCAST_MESSAGE_TO_ALL,
  message,
})

export const BROADCAST_ACTION_TO_USER_ID = asyncConst('action user id')
export const afBroadcastActionToUserId = (userId, action) => ({
  type: BROADCAST_ACTION_TO_USER_ID,
  userId,
  action,
})
export const BROADCAST_ACTION_TO_USER_IDS = asyncConst('action user ids')
export const afBroadcastActionToUserIds = (userIds, action) => ({
  type: BROADCAST_ACTION_TO_USER_IDS,
  userIds,
  action,
})
export const BROADCAST_ACTION_TO_ALL = asyncConst('action all')
export const afBroadcastActionToAll = (action) => ({
  type: BROADCAST_ACTION_TO_ALL,
  action,
})

export const USER_CONNECTED = asyncConst('user connected')
export const afUserConnected = (userId) => ({
  type: USER_CONNECTED,
  userId,
})
