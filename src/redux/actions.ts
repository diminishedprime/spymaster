import * as ta from "typesafe-actions";
import * as t from "../types";

// export const afAddUser = (userId: t.UserId, ws: any) => ({
//   type: t.ServerActionType.ADD_USER,
//   ws,
//   userId
// });

// export const afRemoveUser = (userId: t.UserId) => ({
//   type: t.ServerActionType.REMOVE_USER,
//   userId
// });

export const startGame = ta.createAction(
  "start-game",
  action => (gameId: t.GameId) => action({ gameId })
);

export const requestRole = ta.createAction(
  "request-role",
  action => (gameId: t.GameId, role: t.Role) => action({ role, gameId })
);

export const setPlayerId = ta.createAction(
  "set-player-id",
  action => (playerId: t.PlayerId) => action({ id: playerId })
);

export const setPage = ta.createAction("set-page", action => (page: t.Page) =>
  action({ page })
);

export const setGame = ta.createAction("set-game", action => (game: t.Game) =>
  action({ game })
);

export const newGame = ta.createAction("new-game", action => () =>
  action({ newGame: "newGame" })
);

export const requestTeam = ta.createAction(
  "request-team",
  action => (gameId: t.GameId, team: t.PlayerTeam) => action({ team, gameId })
);

export const joinGame = ta.createAction(
  "join-game",
  action => (gameId: t.GameId) => action({ gameId })
);

export const noOp = ta.createAction("no-op", action => () => action({}));

export const connectWebsocket = ta.createAction(
  "connect-websocket",
  action => (url: string) => action({ url })
);

export const setSocket = ta.createAction(
  "set-socket",
  action => (socket: SocketIOClient.Socket) => action({ socket })
);

export const setGameIds = ta.createAction(
  "set-game-ids",
  action => (gameIds: t.GameId[]) => action({ gameIds })
);

// import React from "react";
// import * as l from "lens.ts";
// import * as m from "monocle-ts";
// import * as t from "../types";
// import * as reactRedux from "react-redux";
// import * as fp from "fp-ts";

// Actions & Action Creators
// export const afSetPage = (page: t.Page) => {
//   return {
//     type: t.ActionType.SET_PAGE,
//     page
//   };
// };

// export const afSetCardFlipped = (cardId: t.CardId) => {
//   return {
//     type: t.ActionType.SET_CARD_FLIPPED,
//     cardId
//   };
// };

// const afPickRole = (team: t.Team, role: t.Role): t.PickRole => {
//   return {
//     type: t.ActionType.PICK_ROLE,
//     team,
//     role
//   };
// };

// export const afSetTime = (seconds: number) => {
//   return {
//     type: t.ActionType.SET_TIME,
//     seconds
//   };
// };

// export const afError = (text: string, severity: t.Severity) => {
//   return {
//     type: t.ActionType.ERROR_OCCURED,
//     text,
//     severity
//   };
// };

// export const afDismissError = (): t.DimissError => {
//   return {
//     type: t.ActionType.DISMISS_ERROR
//   };
// };

// export const afSetWs = (ws: any) => {
//   return {
//     type: t.ActionType.SET_WS,
//     ws
//   };
// };

// export const afSetUsername = (username: string): t.SetUsername => {
//   return {
//     type: t.ActionType.SET_USERNAME,
//     username
//   };
// };

// export const afSetEditing = (flag = true): t.SetEditing => {
//   return {
//     type: t.ActionType.SET_EDITING,
//     flag
//   };
// };

// export const afUpdateUserList = (users: any) => {
//   return {
//     type: t.ActionType.UPDATE_USER_LIST,
//     users
//   };
// };

// export const afUpdateRemoteState = (remoteState: any) => {
//   return {
//     type: t.ActionType.UPDATE_REMOTE_STATE,
//     remoteState
//   };
// };

// export const afAddUser = (user: any) => {
//   return {
//     type: t.ActionType.ADD_USER,
//     user
//   };
// };

// export const afRemoveUser = (user: any) => {
//   return {
//     type: t.ActionType.REMOVE_USER,
//     user
//   };
// };

// export const afUpdateUsername = (user: any, username: string) => {
//   return {
//     type: t.ActionType.UPDATE_USERNAME,
//     user,
//     username
//   };
// };

// export const afUpdateHint = (hint: string): t.UpdateHint => {
//   return {
//     type: t.ActionType.UPDATE_HINT,
//     hint
//   };
// };

// export const afStartTimer = (): t.StartTimer => {
//   return {
//     type: t.ActionType.START_TIMER
//   };
// };

// export const afUpdateHintNumber = (
//   hintNumber: t.HintNumber
// ): t.UpdateHintNumber => {
//   return {
//     type: t.ActionType.UPDATE_HINT_NUMBER,
//     hintNumber
//   };
// };

// export const afNextTurn = (): t.NextTurn => {
//   return {
//     type: t.ActionType.NEXT_TURN
//   };
// };

// export const afForfeit = (team: t.Team): t.Forfeit => {
//   return {
//     type: t.ActionType.FORFEIT,
//     team
//   };
// };

// export const afStopTimer = () => {
//   return {
//     type: t.ActionType.STOP_TIMER
//   };
// };

// export const afNewGame = (): t.NewGame => {
//   return {
//     type: t.ActionType.NEW_GAME
//   };
// };

// export const afEmitAction = (action: any) => {
//   return {
//     type: t.ActionType.EMIT_ACTION,
//     action
//   };
// };

// export const afSetServerUsername = (username: string): t.SetServerUsername => {
//   return {
//     type: t.ActionType.SET_SERVER_USERNAME,
//     username
//   };
// };

// export const afListenToWebsocket = () => {
//   return {
//     type: t.ActionType.LISTEN_TO_WEBSOCKET
//   };
// };

// export const afChangeBackgroundColor = (
//   team: t.Team,
//   backgroundColor: string
// ): t.ChangeBackgroundColor => {
//   return {
//     type: t.ActionType.CHANGE_BACKGROUND_COLOR,
//     team,
//     backgroundColor
//   };
// };

// export const afSubmitHint = (): t.SubmitHint => {
//   return {
//     type: t.ActionType.SUBMIT_HINT
//   };
// };

// export const afFlipCard = (cardId: t.CardId): t.FlipCard => {
//   return {
//     type: t.ActionType.FLIP_CARD,
//     cardId
//   };
// };

// // Newish?
// export const afNewGame2 = (): t.NewGame2 => {
//   return {
//     type: t.ActionType.NEW_GAME_2
//   };
// };

// export const afSetUserId = (userId: t.UserId) => {
//   return {
//     type: t.ActionType.SET_USER_ID,
//     userId
//   };
// };

// export const afSetGameIds = (gameIds: Array<t.GameId>) => {
//   return {
//     type: t.ActionType.SET_GAME_IDS,
//     gameIds
//   };
// };

// export const afSetGameId = (gameId: t.GameId) => {
//   return {
//     type: t.ActionType.SET_GAME_ID,
//     gameId
//   };
// };

// export const afJoinGame = (gameId: t.GameId, userId: t.UserId): t.JoinGame => {
//   return {
//     type: t.ActionType.JOIN_GAME,
//     gameId,
//     userId
//   };
// };

// export const afConnectToServer = (serverAddress: string): t.ConnectToServer => {
//   return {
//     type: t.ActionType.CONNECT_TO_SERVER,
//     serverAddress
//   };
// };

// export const afUpdateServerAddress = (serverAddress: string) => {
//   return {
//     type: t.ActionType.UPDATE_SERVER_ADDRESS,
//     serverAddress
//   };
// };

// export const afSetConnected = (flag: boolean) => {
//   return {
//     type: t.ActionType.SET_CONNECTED,
//     flag
//   };
// };

// const afToServer = (action: t.ServerAction): t.ToServer => {
//   return {
//     type: t.ActionType.TO_SERVER,
//     action
//   };
// };

// // TODO: - once this hook is standardized, update to use it directly.
// export const useSelector = <T>(
//   selector: (state: t.ReduxState) => T,
//   comparisonFn?: (t1: T, t2: T) => boolean
// ): T => {
//   return (reactRedux as any).useSelector(selector, comparisonFn);
// };

// export const useOptionLens = <T>(
//   lens: m.Optional<t.ReduxState, T>
// ): fp.option.Option<T> => {
//   return useSelector(lens.getOption);
// };

// export const useLens = <T>(lens: m.Lens<t.ReduxState, T>) => {
//   return useSelector(lens.get);
// };

// const useDispatch: () => t.Dispatch = (reactRedux as any).useDispatch;

// export const useApi = (): t.Api => {
//   const dispatch = useDispatch();

//   const connectToServer = React.useCallback(
//     (serverAddress: string) => {
//       dispatch(afConnectToServer(serverAddress));
//     },
//     [dispatch]
//   );

//   const newGame = React.useCallback(() => {
//     dispatch(afToServer(afNewGame2()));
//   }, [dispatch]);

//   const setBackgroundColor = React.useCallback(
//     (team, color) => {
//       dispatch(afToServer(afChangeBackgroundColor(team, color)));
//     },
//     [dispatch]
//   );

//   const pickRole = React.useCallback(
//     (team, role) => {
//       dispatch(afToServer(afPickRole(team, role)));
//     },
//     [dispatch]
//   );

//   const joinGame = React.useCallback(
//     (gameId, userId) => {
//       dispatch(afToServer(afJoinGame(gameId, userId)));
//     },
//     [dispatch]
//   );

//   const changeUsername = React.useCallback(
//     username => {
//       dispatch(afToServer(afSetServerUsername(username)));
//     },
//     [dispatch]
//   );

//   const dismissError = React.useCallback(() => {
//     dispatch(afToServer(afDismissError()));
//   }, [dispatch]);

//   const api: t.Api = {
//     dismissError,
//     changeUsername,
//     joinGame,
//     pickRole,
//     setBackgroundColor,
//     connectToServer,
//     newGame
//   };
//   return api;
// };
