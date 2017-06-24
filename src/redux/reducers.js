import paths from './paths.js'
import {FLIP_CARD, CHANGE_COLOR, PICK_ROLE, SET_TIME, TOGGLE_TITLE, ERROR_OCCURED, DISMISS_ERROR, ADD_TO_ACTION_LOG, CLEAR_ACTION_LOG, RESET_STATE, REPLAYING, SET_WS} from './actions.js'
import { GAME_MODE_GAME } from '../constants.js'
import {initialActionLog, initialErrorState, initialState} from './initial-state.js'
import R from 'ramda'

const replayingAction = (state, {flag}) =>
  R.set(paths.replayingPath, flag, state)

const clearActionLog = (state, _) =>
  R.set(paths.actionLogPath, initialActionLog, state)

const addToActionLog = (state, action) =>
  R.over(paths.actionLogPath, R.append(action), state)

const hiError = (state, {
  text='The request failed',
  severity='error',
}) =>
  R.set(paths.errorSeverityPath, severity, R.set(paths.errorTextPath, text, state))

const dismissError = (state, _) =>
  R.set(paths.errorPath, initialErrorState, state)

const toggleTitle = (state, _) =>
  R.over(paths.showTitlePath, R.not, state)

const setTime = (state, {seconds}) =>
  R.set(paths.timePath, seconds, state)

const otherTeam = (team) => team === 1 ? 2 : 1

const changeColor = (state, {team, color}) => {
  const otherTeamsColor = R.view(paths.backgroundColorPath(otherTeam(team)), state)
  return (color !== otherTeamsColor)
    ? R.set(paths.backgroundColorPath(team), color, state)
    : state
}

const pickRole = (state, {team, role}) => {
  const withPlayerType = R.set(paths.playerTypePath, ({team, role}))
  const withGameMode = R.set(paths.gameModePath, GAME_MODE_GAME)

  return R.compose(
    withPlayerType,
    withGameMode
  )(state)
}

const flipCard = (state, {id}) => {
  const cards = R.view(paths.cardsPath, state),
        cardIdx = R.findIndex((card) => card.id === id, cards)
  return R.set(paths.cardsFlippedPath(cardIdx), true, state)
}

const setWs = (state, {ws}) =>
  R.set(paths.wsPath, ws, state)

export const app = (state=initialState, action) => {
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
    case SET_WS:
      return setWs(state, action)
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
