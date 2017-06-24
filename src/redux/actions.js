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
