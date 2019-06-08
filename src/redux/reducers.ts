import * as R from 'ramda'
import * as t from '../types'

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
  initialErrorState,
  initialState,
} from './initial-state'

const hiError = (state: t.ReduxState, {text, severity}: t.ERROR_OCCUREDAction) =>
  R.set(errorSeverityPath, severity, R.set(errorTextPath, text, state))

const dismissError = (state: t.ReduxState) =>
  R.set(errorPath, initialErrorState, state)

const toggleTitle = (state: t.ReduxState) =>
  R.over(showTitlePath, R.not, state)

const pickRole = (state: t.ReduxState, {team, role}: t.PICK_ROLEAction) => {
  const first = R.set(playerTypePath, ({team, role}), state);
  const second = R.set(pagePath, GAME_MODE_GAME, first);
  return second;
}

const setWs = (state: t.ReduxState, {ws}: t.SET_WSAction) =>
  R.set(wsPath, ws, state)

const setUsername = (state: t.ReduxState, {username}: t.SET_USERNAMEAction) =>
  R.set(usernamePath, username, state)

const setEditing = (state: t.ReduxState, {flag}: t.SET_EDITINGAction) =>
  R.set(editingPath, flag, state)

const updateRemoteState = (state: t.ReduxState, {remoteState}: t.UPDATE_REMOTE_STATEAction) =>
  R.set(remoteStatePath, remoteState, state)

const setPage = (state: t.ReduxState, {page}: t.SET_PAGEAction) =>
  R.set(pagePath, page, state)

export const updateHint = (state: t.ReduxState, {hint}: t.UPDATE_HINTAction) =>
  R.set(hintTextPath, hint, state)

export const updateServerAddress = (state: t.ReduxState, {serverAddress}: t.UPDATE_SERVER_ADDRESSAction) =>
  R.set(serverAddressPath, serverAddress, state)

export const updateHintNumber = (state: t.ReduxState, {hintNumber}: t.UPDATE_HINT_NUMBERAction) =>
  R.set(hintNumberPath, hintNumber, state)

export const setUserId = (state: t.ReduxState, {userId}: t.SET_USER_IDAction) =>
  R.set(userIdPath, userId, state)

const setGameIds = (state: t.ReduxState, {gameIds}: t.SET_GAME_IDSAction) =>
  R.set(gameIdsPath, gameIds, state)

const setGameId = (state: t.ReduxState, {gameId}: t.SET_GAME_IDAction) =>
  R.set(gameIdPath, gameId, state)

const setConnected = (state: t.ReduxState, {flag}: t.SET_CONNECTEDAction) =>
  R.set(connectedPath, flag, state)

export const app = (state=initialState, action: t.Action) => {
  switch(action.type) {
    case t.ActionType.SET_GAME_ID: return setGameId(state, action.action)
    case t.ActionType.SET_GAME_IDS: return setGameIds(state, action.action)
    case t.ActionType.SET_USER_ID: return setUserId(state, action.action)
    case t.ActionType.UPDATE_HINT_NUMBER: return updateHintNumber(state, action.action)
    case t.ActionType.UPDATE_HINT: return updateHint(state, action.action)
    case t.ActionType.SET_PAGE: return setPage(state, action.action)
    case t.ActionType.DISMISS_ERROR: return dismissError(state)
    case t.ActionType.ERROR_OCCURED: return hiError(state, action.action)
    case t.ActionType.TOGGLE_TITLE: return toggleTitle(state)
    case t.ActionType.PICK_ROLE: return pickRole(state, action.action)
    case t.ActionType.SET_WS: return setWs(state, action.action)
    case t.ActionType.SET_USERNAME: return setUsername(state, action.action)
    case t.ActionType.SET_EDITING: return setEditing(state, action.action)
    case t.ActionType.UPDATE_REMOTE_STATE: return updateRemoteState(state, action.action)
    case t.ActionType.UPDATE_SERVER_ADDRESS: return updateServerAddress(state, action.action)
    case t.ActionType.SET_CONNECTED: return setConnected(state, action.action)
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
