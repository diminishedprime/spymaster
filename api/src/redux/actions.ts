import * as t from "../types";
import * as http from "http";
import * as io from "socket.io";

// export const afAddUser = (userId: t.UserId, ws: any) => ({
//   type: t.ServerActionType.ADD_USER,
//   ws,
//   userId
// });

// export const afRemoveUser = (userId: t.UserId) => ({
//   type: t.ServerActionType.REMOVE_USER,
//   userId
// });

export const connectWebsocket = (
  httpServer: http.Server
): t.ConnectWebsocket => ({
  type: t.ServerActionType.ConnectWebsocket,
  server: httpServer
});

export const addUser = (id: t.UserId, socket: io.Socket): t.AddUser2 => ({
  type: t.ServerActionType.AddUser,
  user: {
    id,
    socket
  }
});

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
