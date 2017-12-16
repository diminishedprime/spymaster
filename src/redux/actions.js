// Actions & Action Creators
export const SET_PAGE = 'set page'
export const afSetPage = (page) => ({
  type: SET_PAGE,
  page,
})

export const SET_CARD_FLIPPED = 'flip this card'
export const afSetCardFlipped = (cardId) => ({
  type: SET_CARD_FLIPPED,
  cardId,
})

export const PICK_ROLE = 'change role'
export const afPickRole = (team, role) => ({
  type: PICK_ROLE,
  team,
  role,
})

export const SET_TIME = 'set time'
export const afSetTime = (seconds) => ({
  type: SET_TIME,
  seconds,
})

export const TOGGLE_TITLE = 'toggle title'
export const afToggleTitle = () => ({
  type: TOGGLE_TITLE,
})

export const ERROR_OCCURED = 'an error has occured'
export const afError = (text, severity) => ({
  type: ERROR_OCCURED,
  text,
  severity,
})

export const DISMISS_ERROR = 'dismiss error'
export const afDismissError = () => ({
  type: DISMISS_ERROR,
})

export const SET_WS = 'set ws'
export const afSetWs = (ws) => ({
  type: SET_WS,
  ws,
})

export const SET_USERNAME = 'set username'
export const afSetUsername = (username) => ({
  type: SET_USERNAME,
  username,
})

export const SET_EDITING = 'set editing'
export const afSetEditing = (flag=true) => ({
  type: SET_EDITING,
  flag,
})

export const UPDATE_USER_LIST = 'update user list'
export const afUpdateUserList = (users) => ({
  type: UPDATE_USER_LIST,
  users,
})

export const UPDATE_REMOTE_STATE = 'update remote state'
export const afUpdateRemoteState = (remoteState) => ({
  type: UPDATE_REMOTE_STATE,
  remoteState,
})

export const ADD_USER = 'server add user'
export const afAddUser = (user) => ({
  type: ADD_USER,
  user,
})

export const REMOVE_USER = 'server remove user'
export const afRemoveUser = (user) => ({
  type: REMOVE_USER,
  user,
})

export const UPDATE_USERNAME = 'server update username'
export const afUpdateUsername = (user, username) => ({
  type: UPDATE_USERNAME,
  user,
  username,
})

export const UPDATE_HINT = 'update hint'
export const afUpdateHint = (hint) => ({
  type: UPDATE_HINT,
  hint,
})

export const START_TIMER = 'async start timer'
export const afStartTimer = () => ({
  type: START_TIMER,
})

export const UPDATE_HINT_NUMBER = 'update hint number'
export const afUpdateHintNumber = (hintNumber) => ({
  type: UPDATE_HINT_NUMBER,
  hintNumber,
})

export const NEXT_TURN = 'next turn'
export const afNextTurn = () => ({
  type: NEXT_TURN,
})

export const FORFEIT = 'forfeit'
export const afForfeit = (team) => ({
  type: FORFEIT,
  team,
})

export const STOP_TIMER = 'async stop timer'
export const afStopTimer = () => ({
  type: STOP_TIMER,
})

export const NEW_GAME = 'async new game'
export const afNewGame = () => ({
  type: NEW_GAME,
})

export const EMIT_ACTION = 'async emit'
export const afEmitAction = (action) => ({
  type: EMIT_ACTION,
  action,
})

export const SET_SERVER_USERNAME = 'async set server username'
export const afSetServerUsername = () => ({
  type: SET_SERVER_USERNAME,
})

export const LISTEN_TO_WEBSOCKET = 'async listen to websocket'
export const afListenToWebsocket = () => ({
  type: LISTEN_TO_WEBSOCKET,
})

export const CHANGE_BACKGROUND_COLOR = 'async change backgroundColor'
export const afChangeBackgroundColor = (team, backgroundColor) => ({
  type: CHANGE_BACKGROUND_COLOR,
  team,
  backgroundColor,
})

export const SUBMIT_HINT = 'async submit hint'
export const afSubmitHint = () => ({
  type: SUBMIT_HINT,
})

export const FLIP_CARD = 'async flip card'
export const afFlipCard = (cardId) => ({
  type: FLIP_CARD,
  cardId,
})


// Newish?
export const NEW_GAME_2 = 'async new game 2'
export const afNewGame2 = () => ({
  type: NEW_GAME_2,
})

export const SET_USER_ID = 'set user id'
export const afSetUserId = (userId) => ({
  type: SET_USER_ID,
  userId,
})

export const SET_GAME_IDS = 'set game ids'
export const afSetGameIds = (gameIds) => ({
  type: SET_GAME_IDS,
  gameIds,
})

export const SET_GAME_ID = 'set game id'
export const afSetGameId = (gameId) => ({
  type: SET_GAME_ID,
  gameId,
})

export const JOIN_GAME = 'async join game'
export const afJoinGame = (gameId, userId) => ({
  type: JOIN_GAME,
  gameId,
  userId,
})

export const CONNECT_TO_SERVER = 'async connect to server'
export const afConnectToServer = (serverAddress) => ({
  type: CONNECT_TO_SERVER,
  serverAddress,
})

export const UPDATE_SERVER_ADDRESS = 'update server address'
export const afUpdateServerAddress = (serverAddress) => ({
  type: UPDATE_SERVER_ADDRESS,
  serverAddress,
})

export const SET_CONNECTED = 'set connected'
export const afSetConnected = (flag) => ({
  type: SET_CONNECTED,
  flag,
})
