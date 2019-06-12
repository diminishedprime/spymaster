import * as R from "ramda";
import * as t from "../types";
import * as lens from "./lenses";

import { GAME_MODE_GAME } from "../constants";

import {
  gameIdPath,
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
  connectedPath
} from "./paths";
import { initialErrorState, initialState } from "./initial-state";

const hiError = (state: t.ReduxState, { text, severity }: t.ErrorOccured) =>
  R.set(errorSeverityPath, severity, R.set(errorTextPath, text, state));

const dismissError = (state: t.ReduxState) =>
  R.set(errorPath, initialErrorState, state);

const toggleTitle = (state: t.ReduxState) =>
  R.over(showTitlePath, R.not, state);

const pickRole = (state: t.ReduxState, { team, role }: t.PickRole) => {
  const first = R.set(playerTypePath, { team, role }, state);
  const second = R.set(pagePath, GAME_MODE_GAME, first);
  return second;
};

const setWs = (state: t.ReduxState, { ws }: t.SetWs) =>
  R.set(wsPath, ws, state);

const setUsername = (state: t.ReduxState, { username }: t.SetUsername) =>
  R.set(usernamePath, username, state);

const setEditing = (state: t.ReduxState, { flag }: t.SetEditing) =>
  R.set(editingPath, flag, state);

const updateRemoteState = (
  state: t.ReduxState,
  { remoteState }: t.UpdateRemoteState
) => R.set(remoteStatePath, remoteState, state);

const setPage = (state: t.ReduxState, { page }: t.SetPage) =>
  R.set(pagePath, page, state);

export const updateHint = (state: t.ReduxState, { hint }: t.UpdateHint) =>
  R.set(hintTextPath, hint, state);

export const updateServerAddress = (
  state: t.ReduxState,
  { serverAddress }: t.UpdateServerAddress
) => R.set(serverAddressPath, serverAddress, state);

export const updateHintNumber = (
  state: t.ReduxState,
  { hintNumber }: t.UpdateHintNumber
) => R.set(hintNumberPath, hintNumber, state);

export const setUserId = (state: t.ReduxState, { userId }: t.SetUserId) =>
  R.set(userIdPath, userId, state);

const setGameIds = (state: t.ReduxState, { gameIds }: t.SetGameIds) =>
  lens.gameIds.set(gameIds)(state);

const setGameId = (state: t.ReduxState, { gameId }: t.SetGameId) =>
  R.set(gameIdPath, gameId, state);

const setConnected = (state: t.ReduxState, { flag }: t.SetConnected) =>
  R.set(connectedPath, flag, state);

export const app = (state: t.ReduxState = initialState, action: t.Action) => {
  switch (action.type) {
    case t.ActionType.SET_GAME_ID:
      return setGameId(state, action);
    case t.ActionType.SET_GAME_IDS:
      return setGameIds(state, action);
    case t.ActionType.SET_USER_ID:
      return setUserId(state, action);
    case t.ActionType.UPDATE_HINT_NUMBER:
      return updateHintNumber(state, action);
    case t.ActionType.UPDATE_HINT:
      return updateHint(state, action);
    case t.ActionType.SET_PAGE:
      return setPage(state, action);
    case t.ActionType.DISMISS_ERROR:
      return dismissError(state);
    case t.ActionType.ERROR_OCCURED:
      return hiError(state, action);
    case t.ActionType.TOGGLE_TITLE:
      return toggleTitle(state);
    case t.ActionType.PICK_ROLE:
      return pickRole(state, action);
    case t.ActionType.SET_WS:
      return setWs(state, action);
    case t.ActionType.SET_USERNAME:
      return setUsername(state, action);
    case t.ActionType.SET_EDITING:
      return setEditing(state, action);
    case t.ActionType.UPDATE_REMOTE_STATE:
      return updateRemoteState(state, action);
    case t.ActionType.UPDATE_SERVER_ADDRESS:
      return updateServerAddress(state, action);
    case t.ActionType.SET_CONNECTED:
      return setConnected(state, action);
    default:
      if (
        !(action.type.startsWith("async") || action.type.startsWith("@@redux"))
      ) {
        // eslint-disable-next-line no-console
        console.log(`${action.type} not handled`);
      }
      return state;
  }
};
