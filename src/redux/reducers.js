import R from 'ramda'

import {
  GAME_MODE_GAME,
} from '../constants.js'

import {
  remoteStatePath,
  errorSeverityPath,
  errorPath,
  showTitlePath,
  playerTypePath,
  gameModePath,
  wsPath,
  usernamePath,
  editingPath,
  errorTextPath,
} from './paths.js'
import {
  SET_GAME_MODE,
  PICK_ROLE,
  TOGGLE_TITLE,
  ERROR_OCCURED,
  DISMISS_ERROR,
  SET_WS,
  SET_USERNAME,
  SET_EDITING,
  UPDATE_REMOTE_STATE,
} from './actions.js'
import {
  initialErrorState,
  initialState,
} from './initial-state.js'

const hiError = (state, {text, severity}) =>
  R.set(errorSeverityPath, severity, R.set(errorTextPath, text, state))

const dismissError = (state, _) =>
  R.set(errorPath, initialErrorState, state)

const toggleTitle = (state, _) =>
  R.over(showTitlePath, R.not, state)

const pickRole = (state, {team, role}) => R.compose(
  R.set(playerTypePath, ({team, role})),
  R.set(gameModePath, GAME_MODE_GAME)
)(state)

const setWs = (state, {ws}) =>
  R.set(wsPath, ws, state)

const setUsername = (state, {username}) =>
  R.set(usernamePath, username, state)

const setEditing = (state, {flag}) =>
  R.set(editingPath, flag, state)

const updateRemoteState = (state, {remoteState}) =>
  R.set(remoteStatePath, remoteState, state)

export const setGameMode = (state, {gameMode}) =>
  R.set(gameModePath, gameMode, state)

export const app = (state=initialState, action) => {
  switch(action.type) {
    case SET_GAME_MODE: return setGameMode(state, action)
    case DISMISS_ERROR: return dismissError(state, action)
    case ERROR_OCCURED: return hiError(state, action)
    case TOGGLE_TITLE: return toggleTitle(state, action)
    case PICK_ROLE: return pickRole(state, action)
    case SET_WS: return setWs(state, action)
    case SET_USERNAME: return setUsername(state, action)
    case SET_EDITING: return setEditing(state, action)
    case UPDATE_REMOTE_STATE: return updateRemoteState(state, action)
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
