import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from './sagas/index.js'
import R from 'ramda'

// Paths & Initial State
const counterPath = R.lensPath(['counter'])
const heartbeatsPath = R.lensPath(['heartbeats'])
const hiPath = R.lensPath(['hi'])
const errorPath = R.lensPath(['error'])
const errorTextPath = R.lensPath(['error', 'text'])
const errorSeverityPath = R.lensPath(['error', 'severity'])
const actionLogPath = R.lensPath(['actionLog'])
const replayingPath = R.lensPath(['replaying'])

const initialActionLog = []
const initialErrorState = {}

const initialState = {
  counter: 0,
  heartbeats: 0,
  hi: [],
  error: initialErrorState,
  actionLog: initialActionLog,
  replaying: false,
}

// Actions & Action Creators
const INCREMENT_HEARTBEATS = 'increment heartbeats'
export const afIncrementHeartbeats = () => ({
  type: INCREMENT_HEARTBEATS,
})

const INCREMENT_COUNTER = 'increment counter'
export const afIncrementCounter = () => ({
  type: INCREMENT_COUNTER,
})

const APPEND_HI = 'append hi'
export const afAppendHi = (hi) => ({
  type: APPEND_HI,
  hi,
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

const incrementCounterReducer = (state, _) =>
  R.over(counterPath, R.inc, state)

const incrementHeartbeatReducer = (state, _) =>
  R.over(heartbeatsPath, R.inc, state)

const appendHiReducer = (state, {hi}) =>
  R.over(hiPath, R.append(hi), state)

const hiErrorReducer = (state, {
  text='The request failed',
  severity='error',
}) =>
  R.set(errorSeverityPath, severity, R.set(errorTextPath, text, state))

const dismissErrorReducer = (state, _) =>
  R.set(errorPath, initialErrorState, state)

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
    case APPEND_HI:
      return appendHiReducer(state, action)
    case INCREMENT_HEARTBEATS:
      return incrementHeartbeatReducer(state, action)
    case INCREMENT_COUNTER:
      return incrementCounterReducer(state, action)
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
