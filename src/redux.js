import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from './sagas/index.js'
import R from 'ramda'
import words from './words.js'
import shuffle from 'shuffle-array'
import uuid4 from 'uuid/v4'

shuffle(words)

// Paths & Initial State
const timePath = R.lensPath(['time'])
const errorPath = R.lensPath(['error'])
const errorTextPath = R.lensPath(['error', 'text'])
const errorSeverityPath = R.lensPath(['error', 'severity'])
const actionLogPath = R.lensPath(['actionLog'])
const replayingPath = R.lensPath(['replaying'])
const showTitlePath = R.lensPath(['settings', 'showTitle'])
const playerTypePath = R.lensPath(['localState', 'playerType'])
const gameModePath = R.lensPath(['localState', 'gameMode'])
const cardsPath = R.lensPath(['cards'])

const randTeam = () => {
  const rnd = Math.random()
  return (rnd >= 0.0 && rnd < 0.25)
    ? '1'
    : (rnd >= 0.25 && rnd < 0.5)
      ? '2'
      : (rnd >= 0.5 && rnd < 0.75)
        ? 'assassin'
        : 'bystander'
}

const initialCards = R.compose(
  R.map((card) => R.assoc('id', uuid4(), card)),
  R.map((text) => ({
    text,
    flipped: false,
    team: randTeam(),
  })),
  R.take(25)
)(words)
const initialActionLog = []
const initialErrorState = {}
const initialSettings = {
  showTitle: true,
}

const GAME_MODE_PICK_TEAM = 'pick team'
const GAME_MODE_GAME = 'game'

const initialState = {
  currentTeam: (Math.random() > 0.5) ? '1' : '2',
  colors: {
    '1': { backgroundColor: '#f44336' },
    '2': { backgroundColor: '#2196f3' },
    'assassin': { backgroundColor: '#000000'},
    'bystander': { backgroundColor: '#686868'},
  },
  localState: {
    playerType: {role: 'spymaster', team: 1},
    gameMode: GAME_MODE_PICK_TEAM,
  },
  cards: initialCards,
  error: initialErrorState,
  actionLog: initialActionLog,
  settings: initialSettings,
  replaying: false,
}

// Actions & Action Creators
const FLIP_CARD = 'flip card'
export const afFlipCard = (id) => ({
  type: FLIP_CARD,
  id,
})

const CHANGE_COLOR = 'change color'
export const afChangeColor = (team, color) => ({
  type: CHANGE_COLOR,
  team,
  color,
})

const PICK_ROLE = 'change role'
export const afPickRole = (team, role) => ({
  type: PICK_ROLE,
  team,
  role,
})

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

// s
const replayingAction = (state, {flag}) =>
  R.set(replayingPath, flag, state)

const clearActionLog = (state, _) =>
  R.set(actionLogPath, initialActionLog, state)

const addToActionLog = (state, action) =>
  R.over(actionLogPath, R.append(action), state)

const hiError = (state, {
  text='The request failed',
  severity='error',
}) =>
  R.set(errorSeverityPath, severity, R.set(errorTextPath, text, state))

const dismissError = (state, _) =>
  R.set(errorPath, initialErrorState, state)

const toggleTitle = (state, _) =>
  R.over(showTitlePath, R.not, state)

const setTime = (state, {seconds}) =>
  R.set(timePath, seconds, state)

const otherTeam = (team) => team === 1 ? 2 : 1

const teamColorPath = (team) => R.lensPath(['colors', team, 'backgroundColor'])

const changeColor = (state, {team, color}) => {
  const otherTeamsColor = R.view(teamColorPath(otherTeam(team)), state)
  return (color !== otherTeamsColor)
    ? R.set(teamColorPath(team), color, state)
    : state
}

const pickRole = (state, {team, role}) => {
  const withPlayerType = R.set(playerTypePath, ({team, role}))
  const withGameMode = R.set(gameModePath, GAME_MODE_GAME)

  return R.compose(
    withPlayerType,
    withGameMode
  )(state)
}

const flipCard = (state, {id}) => {
  const cards = R.view(cardsPath, state),
        cardIdx = R.findIndex((card) => card.id === id, cards)
  return R.set(R.lensPath(['cards', cardIdx, 'flipped']), true, state)
}



const app = (state=initialState, action) => {
  switch(action.type) {
    case REPLAYING:
      return replayingAction(state, action)
    case RESET_STATE:
      return initialState
    case CLEAR_ACTION_LOG:
      return clearActionLog(state, action)
    case ADD_TO_ACTION_LOG:
      return addToActionLog(state, action)
    case DISMISS_ERROR:
      return dismissError(state, action)
    case ERROR_OCCURED:
      return hiError(state, action)
    case TOGGLE_TITLE:
      return toggleTitle(state, action)
    case SET_TIME:
      return setTime(state, action)
    case CHANGE_COLOR:
      return changeColor(state, action)
    case PICK_ROLE:
      return pickRole(state, action)
    case FLIP_CARD:
      return flipCard(state, action)
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
  app,
  applyMiddleware(sagaMiddleware)
)
sagaMiddleware.run(rootSaga)
