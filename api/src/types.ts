import { UserId, GameId } from "../../src/types";
export * from "../../src/types";

export enum ServerActionType {
  ADD_USER = "new user",
  REMOVE_USER = "remove user",
  NEW_GAME_SERVER = "new game 2 server",
  JOIN_GAME_SERVER = "join game server",
  CHANGE_BACKGROUND_COLOR_SERVER = "change backgroundColorServer",
  REMOVE_USER_FROM_GAME = "remove user from games"
}

export enum ServerAsyncActionType {
  CONNECT_WEBSOCKET_SERVER = "async connect websocket server",
  BROADCAST_MESSAGE_TO_USER_ID = "async message user id",
  BROADCAST_MESSAGE_TO_USER_IDS = "async message user ids",
  BROADCAST_MESSAGE_TO_ALL = "async message all",
  BROADCAST_ACTION_TO_USER_ID = "async action user id",
  BROADCAST_ACTION_TO_USER_IDS = "async action user ids",
  BROADCAST_ACTION_TO_ALL = "async action all",
  USER_CONNECTED = "async user connected",
  USER_DISCONNECTED = "async user disconnected"
}

export interface CONNECT_WEBSOCKET_SERVERAction {
  type: ServerAsyncActionType.CONNECT_WEBSOCKET_SERVER;
  httpServer: any;
}
export interface BROADCAST_MESSAGE_TO_USER_IDAction {
  type: ServerAsyncActionType.BROADCAST_MESSAGE_TO_USER_ID;
  userId: UserId;
  message: string;
}
export interface BROADCAST_MESSAGE_TO_USER_IDSAction {
  type: ServerAsyncActionType.BROADCAST_MESSAGE_TO_USER_IDS;
  userIds: UserId[];
  message: string;
}
export interface BROADCAST_MESSAGE_TO_ALLAction {
  type: ServerAsyncActionType.BROADCAST_MESSAGE_TO_ALL;
  message: string;
}
export interface BROADCAST_ACTION_TO_USER_IDAction {
  type: ServerAsyncActionType.BROADCAST_ACTION_TO_USER_ID;
  userId: UserId;
  action: any;
}
export interface BROADCAST_ACTION_TO_USER_IDSAction {
  type: ServerAsyncActionType.BROADCAST_ACTION_TO_USER_IDS;
  userIds: UserId[];
  action: any;
}
export interface BROADCAST_ACTION_TO_ALLAction {
  type: ServerAsyncActionType.BROADCAST_ACTION_TO_ALL;
  action: any;
}
export interface USER_CONNECTEDAction {
  type: ServerAsyncActionType.USER_CONNECTED;
  userId: UserId;
}
export interface USER_DISCONNECTEDAction {
  type: ServerAsyncActionType.USER_DISCONNECTED;
  userId: UserId;
}

export interface ADD_USERAction {
  type: ServerActionType.ADD_USER;
  ws: any;
  userId: UserId;
}
export interface REMOVE_USERAction {
  type: ServerActionType.REMOVE_USER;
  userId: UserId;
}
export interface NEW_GAME_SERVERAction {
  type: ServerActionType.NEW_GAME_SERVER;
  gameId: GameId;
  gameState: any;
}
export interface JOIN_GAME_SERVERAction {
  type: ServerActionType.JOIN_GAME_SERVER;
  gameId: GameId;
}
export interface CHANGE_BACKGROUND_COLOR_SERVERAction {
  type: ServerActionType.CHANGE_BACKGROUND_COLOR_SERVER;
  gameId: GameId;
}
export interface REMOVE_USER_FROM_GAMEAction {
  type: ServerActionType.REMOVE_USER_FROM_GAME;
  gameId: GameId;
}

export type ServerAction =
  | CONNECT_WEBSOCKET_SERVERAction
  | BROADCAST_MESSAGE_TO_USER_IDAction
  | BROADCAST_MESSAGE_TO_USER_IDSAction
  | BROADCAST_MESSAGE_TO_ALLAction
  | BROADCAST_ACTION_TO_USER_IDAction
  | BROADCAST_ACTION_TO_USER_IDSAction
  | BROADCAST_ACTION_TO_ALLAction
  | USER_CONNECTEDAction
  | USER_DISCONNECTEDAction
  | ADD_USERAction
  | REMOVE_USERAction
  | NEW_GAME_SERVERAction
  | JOIN_GAME_SERVERAction
  | CHANGE_BACKGROUND_COLOR_SERVERAction
  | REMOVE_USER_FROM_GAMEAction;

export type ServerReduxState = any;
