import * as t from "../types";
import * as lens from "./lenses";
import { initialState } from "./initial-state";

const setError = (state: t.ReduxState, { text, severity }: t.ErrorOccured) => {
  return lens.errorText.set(text)(lens.errorSeverity.set(severity)(state));
};

const dismissError = (state: t.ReduxState) => {
  return lens.error.set(undefined)(state);
};

const pickRole = (state: t.ReduxState, { team, role }: t.PickRole) => {
  const first = lens.playerType.set({ team, role })(state);
  const second = lens.page.set(t.Page.GAME_MODE_GAME)(first);
  return second;
};

const setWs = (state: t.ReduxState, { ws }: t.SetWs) => {
  return lens.ws.set(ws)(state);
};

const setUsername = (state: t.ReduxState, { username }: t.SetUsername) => {
  return lens.username.set(username)(state);
};

const updateRemoteState = (
  state: t.ReduxState,
  { remoteState }: t.UpdateRemoteState
) => {
  return lens.remoteState.set(remoteState)(state);
};

const setPage = (state: t.ReduxState, { page }: t.SetPage) => {
  return lens.page.set(page)(state);
};

export const updateHint = (state: t.ReduxState, { hint }: t.UpdateHint) => {
  return lens.hintText.set(hint)(state);
};

export const updateServerAddress = (
  state: t.ReduxState,
  { serverAddress }: t.UpdateServerAddress
) => {
  return lens.serverAddress.set(serverAddress)(state);
};

export const updateHintNumber = (
  state: t.ReduxState,
  { hintNumber }: t.UpdateHintNumber
) => {
  return lens.hintNumber.set(hintNumber)(state);
};

export const setUserId = (state: t.ReduxState, { userId }: t.SetUserId) => {
  return lens.userId.set(userId)(state);
};

const setGameIds = (state: t.ReduxState, { gameIds }: t.SetGameIds) => {
  return lens.gameIds.set(gameIds)(state);
};

const setGameId = (state: t.ReduxState, { gameId }: t.SetGameId) => {
  return lens.gameId.set(gameId)(state);
};

const setConnected = (state: t.ReduxState, { flag }: t.SetConnected) => {
  return lens.connected.set(flag)(state);
};

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
      return setError(state, action);
    case t.ActionType.PICK_ROLE:
      return pickRole(state, action);
    case t.ActionType.SET_WS:
      return setWs(state, action);
    case t.ActionType.SET_USERNAME:
      return setUsername(state, action);
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
