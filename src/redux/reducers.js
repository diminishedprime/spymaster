import R from 'ramda'

import {
  GAME_MODE_GAME,
} from '../constants'

import {
  gameIdPath,
  gameIdsPath,
  userIdPath,
  remoteStatePath,
  errorSeverityPath,
  errorPath,
  showTitlePath,
  playerTypePath,
  page as pagePath,
  wsPath,
  usernamePath,
  editingPath,
  errorTextPath,
  hintTextPath,
  hintNumberPath,
  serverAddressPath,
  connectedPath,
} from './paths'
import {
  SET_GAME_ID,
  SET_GAME_IDS,
  SET_USER_ID,
  UPDATE_HINT,
  UPDATE_HINT_NUMBER,
  SET_PAGE,
  PICK_ROLE,
  TOGGLE_TITLE,
  ERROR_OCCURED,
  DISMISS_ERROR,
  SET_WS,
  SET_USERNAME,
  SET_EDITING,
  UPDATE_REMOTE_STATE,
  UPDATE_SERVER_ADDRESS,
  SET_CONNECTED,
} from './actions'
import {
  initialErrorState,
  initialState,
} from './initial-state'

const hiError = (state, {text, severity}) =>
  R.set(errorSeverityPath, severity, R.set(errorTextPath, text, state))

const dismissError = (state, _) =>
  R.set(errorPath, initialErrorState, state)

const toggleTitle = (state, _) =>
  R.over(showTitlePath, R.not, state)

const pickRole = (state, {team, role}) => R.compose(
  R.set(playerTypePath, ({team, role})),
  R.set(pagePath, GAME_MODE_GAME)
)(state)

const setWs = (state, {ws}) =>
  R.set(wsPath, ws, state)

const setUsername = (state, {username}) =>
  R.set(usernamePath, username, state)

const setEditing = (state, {flag}) =>
  R.set(editingPath, flag, state)

const updateRemoteState = (state, {remoteState}) =>
  R.set(remoteStatePath, remoteState, state)

const setPage = (state, {page}) =>
  R.set(pagePath, page, state)

export const updateHint = (state, {hint}) =>
  R.set(hintTextPath, hint, state)

export const updateServerAddress = (state, {serverAddress}) =>
  R.set(serverAddressPath, serverAddress, state)

export const updateHintNumber = (state, {hintNumber}) =>
  R.set(hintNumberPath, hintNumber, state)

export const setUserId = (state, {userId}) =>
  R.set(userIdPath, userId, state)

const setGameIds = (state, {gameIds}) =>
  R.set(gameIdsPath, gameIds, state)

const setGameId = (state, {gameId}) =>
  R.set(gameIdPath, gameId, state)

const setConnected = (state, {flag}) =>
  R.set(connectedPath, flag, state)

export const app = (state=initialState, action) => {
  switch(action.type) {
    case SET_GAME_ID: return setGameId(state, action)
    case SET_GAME_IDS: return setGameIds(state, action)
    case SET_USER_ID: return setUserId(state, action)
    case UPDATE_HINT_NUMBER: return updateHintNumber(state, action)
    case UPDATE_HINT: return updateHint(state, action)
    case SET_PAGE: return setPage(state, action)
    case DISMISS_ERROR: return dismissError(state, action)
    case ERROR_OCCURED: return hiError(state, action)
    case TOGGLE_TITLE: return toggleTitle(state, action)
    case PICK_ROLE: return pickRole(state, action)
    case SET_WS: return setWs(state, action)
    case SET_USERNAME: return setUsername(state, action)
    case SET_EDITING: return setEditing(state, action)
    case UPDATE_REMOTE_STATE: return updateRemoteState(state, action)
    case UPDATE_SERVER_ADDRESS: return updateServerAddress(state, action)
    case SET_CONNECTED: return setConnected(state, action)
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
