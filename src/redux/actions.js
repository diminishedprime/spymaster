// Actions & Action Creators
export const FLIP_CARD = 'flip card'
export const afFlipCard = (id) => ({
  type: FLIP_CARD,
  id,
})

export const CHANGE_COLOR = 'change color'
export const afChangeColor = (team, color) => ({
  type: CHANGE_COLOR,
  team,
  color,
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

export const ADD_TO_ACTION_LOG = 'add to action log'
export const afAddToActionLog = (action) => ({
  type: ADD_TO_ACTION_LOG,
  action,
  timestamp: new Date(),
})

export const CLEAR_ACTION_LOG = 'clear action log'
export const afClearActionLog = () => ({
  type: CLEAR_ACTION_LOG,
})

export const RESET_STATE = 'reset state'
export const afResetState = () => ({
  type: RESET_STATE,
})

export const REPLAYING = 'replaying'
export const afReplaying = (flag) => ({
  type: CLEAR_ACTION_LOG,
  flag,
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

export const SUBMIT_HINT = 'submit hint'
export const afSubmitHint = () => ({
  type: SUBMIT_HINT,
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
