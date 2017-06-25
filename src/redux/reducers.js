import paths from './paths.js'
import {
  PICK_ROLE,
  SET_TIME,
  TOGGLE_TITLE,
  ERROR_OCCURED,
  DISMISS_ERROR,
  ADD_TO_ACTION_LOG,
  CLEAR_ACTION_LOG,
  RESET_STATE,
  REPLAYING,
  SET_WS,
  SET_USERNAME,
  SET_EDITING,
  UPDATE_USER_LIST,
  UPDATE_REMOTE_STATE,
  UPDATE_HINT,
  UPDATE_HINT_NUMBER,
} from './actions.js'
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

export const setTime = (state, {seconds}) =>
  R.set(paths.timePath, seconds, state)

const pickRole = (state, {team, role}) => {
  const withPlayerType = R.set(paths.playerTypePath, ({team, role}))
  const withGameMode = R.set(paths.gameModePath, GAME_MODE_GAME)

  return R.compose(
    withPlayerType,
    withGameMode
  )(state)
}

const setWs = (state, {ws}) =>
  R.set(paths.wsPath, ws, state)

const setUsername = (state, {username}) =>
  R.set(paths.usernamePath, username, state)

const setEditing = (state, {flag}) =>
  R.set(paths.editingPath, flag, state)

const updateUserList = (state, {users}) =>
  R.set(paths.userListPath, users, state)

const updateRemoteState = (state, {remoteState}) =>
  R.set(paths.remoteStatePath, remoteState, state)

export const updateHint = (state, {hint}) =>
  R.set(paths.hintTextPath, hint, state)

export const updateHintNumber = (state, {hintNumber}) =>
  R.set(paths.hintNumberPath, hintNumber, state)

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
    case PICK_ROLE:
      return pickRole(state, action)
    case SET_WS:
      return setWs(state, action)
    case SET_USERNAME:
      return setUsername(state, action)
    case SET_EDITING:
      return setEditing(state, action)
    case UPDATE_USER_LIST:
      return updateUserList(state, action)
    case UPDATE_REMOTE_STATE:
      return updateRemoteState(state, action)
    case UPDATE_HINT:
      return updateHint(state, action)
    case UPDATE_HINT_NUMBER: return updateHintNumber(state, action)
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
