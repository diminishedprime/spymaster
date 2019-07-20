import * as t from "../types";
import * as ta from "typesafe-actions";
import * as http from "http";
import * as io from "socket.io";

export const removePlayerFromGame = ta.createAction(
  "remove-player-from-game",
  action => (gameId: t.GameId, playerId: t.PlayerId) =>
    action({ gameId, playerId })
);

export const playerJoinGame = ta.createAction(
  "player-join-game",
  action => (gameId: t.GameId, playerId: t.PlayerId) =>
    action({ gameId, playerId })
);

export const setTeam = ta.createAction(
  "set-team",
  action => (gameId: t.GameId, playerId: t.PlayerId, team: t.PlayerTeam) =>
    action({
      gameId,
      playerId,
      team
    })
);

export const setHint = ta.createAction(
  "set-hint",
  action => (gameId: t.GameId, hint: t.Hint) => action({ gameId, hint })
);

export const setCurrentTeam = ta.createAction(
  "set-current-team",
  action => (gameId: t.GameId, team: t.PlayerTeam) => action({ gameId, team })
);

export const fromClient = ta.createAction(
  "from-client",
  action => (clientId: t.UserId, clientAction: t.ClientRootAction) =>
    action({ clientId, clientAction })
);

// export const afAddUser = (userId: t.UserId, ws: any) => ({
//   type: t.ServerActionType.ADD_USER,
//   ws,
//   userId
// });

// export const afRemoveUser = (userId: t.UserId) => ({
//   type: t.ServerActionType.REMOVE_USER,
//   userId
// });

export const flipCard = ta.createAction(
  "flip-card",
  action => (gameId: t.GameId, cardId: t.CardId) => action({ gameId, cardId })
);

export const setStarted = ta.createAction(
  "set-started",
  action => (gameId: t.GameId, started: boolean) => action({ gameId, started })
);

export const setCards = ta.createAction(
  "set-cards",
  action => (gameId: t.GameId, cards: t.Cards) => action({ gameId, cards })
);

export const setIsReady = ta.createAction(
  "set-is-ready",
  action => (gameId: t.GameId) => action({ gameId })
);

export const setRole = ta.createAction(
  "set-role",
  action => (gameId: t.GameId, userId: t.UserId, role: t.Role) =>
    action({ role, userId, gameId })
);

export const connectWebsocket = ta.createAction(
  "connect-websocket",
  action => (httpServer: http.Server) => action({ httpServer })
);

export const addUser = ta.createAction(
  "add-user",
  action => (id: t.UserId, socket: io.Socket) =>
    action({
      id,
      socket
    })
);

export const removeUserFromServer = ta.createAction(
  "remove-user",
  action => (id: t.UserId) => action({ id })
);

export const sendMessage = ta.createAction(
  "send-message",
  action => (id: t.UserId, message: string) => action({ id, message })
);

export const refreshGameState = ta.createAction(
  "refresh-game-state",
  action => (id: t.GameId) => action({ id })
);

export const sendAction = ta.createAction(
  "send-action",
  action => (id: t.UserId, clientAction: any) => action({ id, clientAction })
);

export const newGame = ta.createAction("new-game", action => (id: t.GameId) =>
  action({ id })
);

export const noOp = ta.createAction("no-op", action => () => action({}));

// export const afBroadcastMessageToUserId = (
//   userId: t.UserId,
//   message: string
// ) => ({
//   type: t.ServerAsyncActionType.BROADCAST_MESSAGE_TO_USER_ID,
//   userId,
//   message
// });
// export const afBroadcastMessageToUserIds = (
//   userIds: t.UserId[],
//   message: string
// ) => ({
//   type: t.ServerAsyncActionType.BROADCAST_MESSAGE_TO_USER_IDS,
//   userIds,
//   message
// });
// export const afBroadcastMessageToAll = (message: string) => ({
//   type: t.ServerAsyncActionType.BROADCAST_MESSAGE_TO_ALL,
//   message
// });

// export const afBroadcastActionToUserId = (userId: t.UserId, action: any) => ({
//   type: t.ServerAsyncActionType.BROADCAST_ACTION_TO_USER_ID,
//   userId,
//   action
// });
// export const afBroadcastActionToUserIds = (
//   userIds: t.UserId[],
//   action: any
// ) => ({
//   type: t.ServerAsyncActionType.BROADCAST_ACTION_TO_USER_IDS,
//   userIds,
//   action
// });
// export const afBroadcastActionToAll = (action: any) => ({
//   type: t.ServerAsyncActionType.BROADCAST_ACTION_TO_ALL,
//   action
// });

// export const afUserConnected = (userId: t.UserId) => ({
//   type: t.ServerAsyncActionType.USER_CONNECTED,
//   userId
// });

// export const afUserDisconnected = (userId: t.UserId) => ({
//   type: t.ServerAsyncActionType.USER_DISCONNECTED,
//   userId
// });

// export const afNewGameServer = (gameId: t.GameId, gameState: any) => ({
//   type: t.ServerActionType.NEW_GAME_SERVER,
//   gameId,
//   gameState
// });

// export const afJoinGameServer = (userId: t.UserId, gameId: t.GameId) => ({
//   type: t.ServerActionType.JOIN_GAME_SERVER,
//   userId,
//   gameId
// });

// export const afChangeBackgroundColorServer = (
//   gameId: t.GameId,
//   team: t.Team,
//   backgroundColor: string
// ) => ({
//   type: t.ServerActionType.CHANGE_BACKGROUND_COLOR_SERVER,
//   team,
//   backgroundColor,
//   gameId
// });

// export const afRemoveUserFromGame = (gameId: t.GameId, userId: t.UserId) => ({
//   type: t.ServerActionType.REMOVE_USER_FROM_GAME,
//   userId,
//   gameId
// });
