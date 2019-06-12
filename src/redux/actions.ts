import React from "react";
import * as t from "../types";
import * as reactRedux from "react-redux";

// Actions & Action Creators
export const afSetPage = (page: t.Page) => ({
  type: t.ActionType.SET_PAGE,
  page
});

export const afSetCardFlipped = (cardId: t.CardId) => ({
  type: t.ActionType.SET_CARD_FLIPPED,
  cardId
});

const afPickRole = (team: t.Team, role: t.Role): t.PickRole => ({
  type: t.ActionType.PICK_ROLE,
  team,
  role
});

export const afSetTime = (seconds: number) => ({
  type: t.ActionType.SET_TIME,
  seconds
});

export const afError = (text: string, severity: t.Severity) => ({
  type: t.ActionType.ERROR_OCCURED,
  text,
  severity
});

export const afDismissError = (): t.DimissError => ({
  type: t.ActionType.DISMISS_ERROR
});

export const afSetWs = (ws: any) => ({
  type: t.ActionType.SET_WS,
  ws
});

export const afSetUsername = (username: string): t.SetUsername => ({
  type: t.ActionType.SET_USERNAME,
  username
});

export const afSetEditing = (flag = true): t.SetEditing => ({
  type: t.ActionType.SET_EDITING,
  flag
});

export const afUpdateUserList = (users: any) => ({
  type: t.ActionType.UPDATE_USER_LIST,
  users
});

export const afUpdateRemoteState = (remoteState: any) => ({
  type: t.ActionType.UPDATE_REMOTE_STATE,
  remoteState
});

export const afAddUser = (user: any) => ({
  type: t.ActionType.ADD_USER,
  user
});

export const afRemoveUser = (user: any) => ({
  type: t.ActionType.REMOVE_USER,
  user
});

export const afUpdateUsername = (user: any, username: string) => ({
  type: t.ActionType.UPDATE_USERNAME,
  user,
  username
});

export const afUpdateHint = (hint: string): t.UpdateHint => ({
  type: t.ActionType.UPDATE_HINT,
  hint
});

export const afStartTimer = (): t.StartTimer => ({
  type: t.ActionType.START_TIMER
});

export const afUpdateHintNumber = (
  hintNumber: t.HintNumber
): t.UpdateHintNumber => ({
  type: t.ActionType.UPDATE_HINT_NUMBER,
  hintNumber
});

export const afNextTurn = (): t.NextTurn => ({
  type: t.ActionType.NEXT_TURN
});

export const afForfeit = (team: t.Team): t.Forfeit => ({
  type: t.ActionType.FORFEIT,
  team
});

export const afStopTimer = () => ({
  type: t.ActionType.STOP_TIMER
});

export const afNewGame = (): t.NewGame => ({
  type: t.ActionType.NEW_GAME
});

export const afEmitAction = (action: any) => ({
  type: t.ActionType.EMIT_ACTION,
  action
});

export const afSetServerUsername = (username: string): t.SetServerUsername => ({
  type: t.ActionType.SET_SERVER_USERNAME,
  username
});

export const afListenToWebsocket = () => ({
  type: t.ActionType.LISTEN_TO_WEBSOCKET
});

export const afChangeBackgroundColor = (
  team: t.Team,
  backgroundColor: string
): t.ChangeBackgroundColor => ({
  type: t.ActionType.CHANGE_BACKGROUND_COLOR,
  team,
  backgroundColor
});

export const afSubmitHint = (): t.SubmitHint => ({
  type: t.ActionType.SUBMIT_HINT
});

export const afFlipCard = (cardId: t.CardId): t.FlipCard => ({
  type: t.ActionType.FLIP_CARD,
  cardId
});

// Newish?
export const afNewGame2 = (): t.NewGame2 => ({
  type: t.ActionType.NEW_GAME_2
});

export const afSetUserId = (userId: t.UserId) => ({
  type: t.ActionType.SET_USER_ID,
  userId
});

export const afSetGameIds = (gameIds: Array<t.GameId>) => ({
  type: t.ActionType.SET_GAME_IDS,
  gameIds
});

export const afSetGameId = (gameId: t.GameId) => ({
  type: t.ActionType.SET_GAME_ID,
  gameId
});

export const afJoinGame = (gameId: t.GameId, userId: t.UserId): t.JoinGame => ({
  type: t.ActionType.JOIN_GAME,
  gameId,
  userId
});

export const afConnectToServer = (
  serverAddress: string
): t.ConnectToServer => ({
  type: t.ActionType.CONNECT_TO_SERVER,
  serverAddress
});

export const afUpdateServerAddress = (serverAddress: string) => ({
  type: t.ActionType.UPDATE_SERVER_ADDRESS,
  serverAddress
});

export const afSetConnected = (flag: boolean) => ({
  type: t.ActionType.SET_CONNECTED,
  flag
});

const afToServer = (action: t.ServerAction): t.ToServer => ({
  type: t.ActionType.TO_SERVER,
  action
});

// TODO: - once this hook is standardized, update to use it directly.
export const useSelector = <T>(
  selector: (state: t.ReduxState) => T,
  comparisonFn?: (t1: T, t2: T) => boolean
): T => {
  return (reactRedux as any).useSelector(selector, comparisonFn);
};

const useDispatch: () => t.Dispatch = (reactRedux as any).useDispatch;

export const useApi = (): t.Api => {
  const dispatch = useDispatch();

  const connectToServer = React.useCallback(
    (serverAddress: string) => {
      dispatch(afConnectToServer(serverAddress));
    },
    [dispatch]
  );

  const newGame = React.useCallback(() => {
    dispatch(afToServer(afNewGame2()));
  }, [dispatch]);

  const setBackgroundColor = React.useCallback(
    (team, color) => {
      dispatch(afToServer(afChangeBackgroundColor(team, color)));
    },
    [dispatch]
  );

  const pickRole = React.useCallback(
    (team, role) => {
      dispatch(afToServer(afPickRole(team, role)));
    },
    [dispatch]
  );

  const joinGame = React.useCallback(
    (gameId, userId) => {
      dispatch(afToServer(afJoinGame(gameId, userId)));
    },
    [dispatch]
  );

  const changeUsername = React.useCallback(
    username => {
      dispatch(afToServer(afSetServerUsername(username)));
    },
    [dispatch]
  );

  const api: t.Api = {
    changeUsername,
    joinGame,
    pickRole,
    setBackgroundColor,
    connectToServer,
    newGame
  };
  return api;
};
