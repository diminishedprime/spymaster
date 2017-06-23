import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from './sagas/index.js'
import R from 'ramda'
import words from './words.js'
import shuffle from 'shuffle-array'

shuffle(words)

// Paths & Initial State
const timePath = R.lensPath(['time'])
const errorPath = R.lensPath(['error'])
const errorTextPath = R.lensPath(['error', 'text'])
const errorSeverityPath = R.lensPath(['error', 'severity'])
const actionLogPath = R.lensPath(['actionLog'])
const replayingPath = R.lensPath(['replaying'])
const showTitlePath = R.lensPath(['settings', 'showTitle'])
const initialCards = R.compose(
  R.map((text) => ({text})),
  R.take(25)
)(words)
const initialActionLog = []
const initialErrorState = {}
const initialSettings = {
  showTitle: true,
}

const initialState = {
  cards: initialCards,
  error: initialErrorState,
  actionLog: initialActionLog,
  settings: initialSettings,
  replaying: false,
}

// Actions & Action Creators
const SET_TIME = 'set time'
export const afSetTime = (seconds) => ({
  type: SET_TIME,
  seconds,
})

const TOGGLE_TITLE = 'toggle title'
export const afToggleTitle = () => ({
  type: TOGGLE_TITLE,
})

const ERROR_OCCURED = 'an error has occured'
export const afError = (text, severity) => ({
  type: ERROR_OCCURED,
  text,
  severity,
})

const DISMISS_ERROR = 'dismiss error'
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

// Reducers
const replayingActionReducer = (state, {flag}) =>
  R.set(replayingPath, flag, state)

const clearActionLogReducer = (state, _) =>
  R.set(actionLogPath, initialActionLog, state)

const addToActionLogReducer = (state, action) =>
  R.over(actionLogPath, R.append(action), state)

const hiErrorReducer = (state, {
  text='The request failed',
  severity='error',
}) =>
  R.set(errorSeverityPath, severity, R.set(errorTextPath, text, state))

const dismissErrorReducer = (state, _) =>
  R.set(errorPath, initialErrorState, state)

const toggleTitle = (state, _) =>
  R.over(showTitlePath, R.not, state)

const setTime = (state, {seconds}) =>
  R.set(timePath, seconds, state)

const appReducer = (state=initialState, action) => {
  switch(action.type) {
    case REPLAYING:
      return replayingActionReducer(state, action)
    case RESET_STATE:
      return initialState
    case CLEAR_ACTION_LOG:
      return clearActionLogReducer(state, action)
    case ADD_TO_ACTION_LOG:
      return addToActionLogReducer(state, action)
    case DISMISS_ERROR:
      return dismissErrorReducer(state, action)
    case ERROR_OCCURED:
      return hiErrorReducer(state, action)
    case TOGGLE_TITLE:
      return toggleTitle(state, action)
    case SET_TIME:
      return setTime(state, action)
    default:
      if (!(
        action.type.startsWith('async') ||
        action.type.startsWith('@@redux')
      )) {
        // eslint-disable-next-line no-console
        console.log(`${action.type} not handled`)
      }
      return state
  }

}

const sagaMiddleware = createSagaMiddleware()
export const store = createStore(
  appReducer,
  applyMiddleware(sagaMiddleware)
)
sagaMiddleware.run(rootSaga)
