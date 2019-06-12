import * as R from "ramda";
import * as t from "../types";
import * as lens from "./lenses";

import { GAME_MODE_GAME } from "../constants";

import * as p from "./paths";
import { initialErrorState, initialState } from "./initial-state";

const hiError = (state: t.ReduxState, { text, severity }: t.ErrorOccured) =>
  R.set(p.errorSeverityPath, severity, R.set(p.errorTextPath, text, state));

const dismissError = (state: t.ReduxState) =>
  R.set(p.errorPath, initialErrorState, state);

const toggleTitle = (state: t.ReduxState) =>
  R.over(p.showTitlePath, R.not, state);

const pickRole = (state: t.ReduxState, { team, role }: t.PickRole) => {
  const first = R.set(p.playerTypePath, { team, role }, state);
  const second = R.set(p.page, GAME_MODE_GAME, first);
  return second;
};

const setWs = (state: t.ReduxState, { ws }: t.SetWs) =>
  R.set(p.wsPath, ws, state);

const setUsername = (state: t.ReduxState, { username }: t.SetUsername) =>
  R.set(p.usernamePath, username, state);

const setEditing = (state: t.ReduxState, { flag }: t.SetEditing) =>
  R.set(p.editingPath, flag, state);

const updateRemoteState = (
  state: t.ReduxState,
  { remoteState }: t.UpdateRemoteState
) => R.set(p.remoteStatePath, remoteState, state);

const setPage = (state: t.ReduxState, { page }: t.SetPage) =>
  R.set(p.page, page, state);

export const updateHint = (state: t.ReduxState, { hint }: t.UpdateHint) =>
  R.set(p.hintTextPath, hint, state);

export const updateServerAddress = (
  state: t.ReduxState,
  { serverAddress }: t.UpdateServerAddress
) => R.set(p.serverAddressPath, serverAddress, state);

export const updateHintNumber = (
  state: t.ReduxState,
  { hintNumber }: t.UpdateHintNumber
) => R.set(p.hintNumberPath, hintNumber, state);

export const setUserId = (state: t.ReduxState, { userId }: t.SetUserId) =>
  lens.userId.set(userId)(state);

const setGameIds = (state: t.ReduxState, { gameIds }: t.SetGameIds) =>
  lens.gameIds.set(gameIds)(state);

const setGameId = (state: t.ReduxState, { gameId }: t.SetGameId) =>
  lens.gameIds.set(a => a.concat([gameId]))(state);

const setConnected = (state: t.ReduxState, { flag }: t.SetConnected) =>
  lens.connected.set(flag)(state);

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
