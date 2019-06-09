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
  CONNECT_WEBSOCKET_SERVER = "connect websocket server",
  BROADCAST_MESSAGE_TO_USER_ID = "message user id",
  BROADCAST_MESSAGE_TO_USER_IDS = "message user ids",
  BROADCAST_MESSAGE_TO_ALL = "message all",
  BROADCAST_ACTION_TO_USER_ID = "action user id",
  BROADCAST_ACTION_TO_USER_IDS = "action user ids",
  BROADCAST_ACTION_TO_ALL = "action all",
  USER_CONNECTED = "user connected",
  USER_DISCONNECTED = "user disconnected"
}

export interface CONNECT_WEBSOCKET_SERVERAction {
  type: ServerAsyncActionType.CONNECT_WEBSOCKET_SERVER;
  httpServer: any;
}
export interface BROADCAST_MESSAGE_TO_USER_IDAction {
  userId: UserId;
  message: string;
}
export interface BROADCAST_MESSAGE_TO_USER_IDSAction {
  userIds: UserId[];
  message: string;
}
export interface BROADCAST_MESSAGE_TO_ALLAction {
  message: string;
}
export interface BROADCAST_ACTION_TO_USER_IDAction {
  userId: UserId;
  action: any;
}
export interface BROADCAST_ACTION_TO_USER_IDSAction {
  userIds: UserId[];
  action: any;
}
export interface BROADCAST_ACTION_TO_ALLAction {
  action: any;
}
export interface USER_CONNECTEDAction {
  userId: UserId;
}
export interface USER_DISCONNECTEDAction {
  userId: UserId;
}

export interface ADD_USERAction {
  ws: any;
  userId: UserId;
}
export interface REMOVE_USERAction {
  userId: UserId;
}
export interface NEW_GAME_SERVERAction {
  gameId: GameId;
  gameState: any;
}
export interface JOIN_GAME_SERVERAction {
  gameId: GameId;
}
export interface CHANGE_BACKGROUND_COLOR_SERVERAction {
  gameId: GameId;
}
export interface REMOVE_USER_FROM_GAMEAction {
  gameId: GameId;
}

export type ServerAction =
  | CONNECT_WEBSOCKET_SERVERAction
  | {
      type: ServerAsyncActionType.BROADCAST_MESSAGE_TO_USER_ID;
      action: BROADCAST_MESSAGE_TO_USER_IDAction;
    }
  | {
      type: ServerAsyncActionType.BROADCAST_MESSAGE_TO_USER_IDS;
      action: BROADCAST_MESSAGE_TO_USER_IDSAction;
    }
  | {
      type: ServerAsyncActionType.BROADCAST_MESSAGE_TO_ALL;
      action: BROADCAST_MESSAGE_TO_ALLAction;
    }
  | {
      type: ServerAsyncActionType.BROADCAST_ACTION_TO_USER_ID;
      action: BROADCAST_ACTION_TO_USER_IDAction;
    }
  | {
      type: ServerAsyncActionType.BROADCAST_ACTION_TO_USER_IDS;
      action: BROADCAST_ACTION_TO_USER_IDSAction;
    }
  | {
      type: ServerAsyncActionType.BROADCAST_ACTION_TO_ALL;
      action: BROADCAST_ACTION_TO_ALLAction;
    }
  | { type: ServerAsyncActionType.USER_CONNECTED; action: USER_CONNECTEDAction }
  | {
      type: ServerAsyncActionType.USER_DISCONNECTED;
      action: USER_DISCONNECTEDAction;
    }
  | { type: ServerActionType.ADD_USER; action: ADD_USERAction }
  | { type: ServerActionType.REMOVE_USER; action: REMOVE_USERAction }
  | { type: ServerActionType.NEW_GAME_SERVER; action: NEW_GAME_SERVERAction }
  | { type: ServerActionType.JOIN_GAME_SERVER; action: JOIN_GAME_SERVERAction }
  | {
      type: ServerActionType.CHANGE_BACKGROUND_COLOR_SERVER;
      action: CHANGE_BACKGROUND_COLOR_SERVERAction;
    }
  | {
      type: ServerActionType.REMOVE_USER_FROM_GAME;
      action: REMOVE_USER_FROM_GAMEAction;
    };

export type ServerReduxState = any;
