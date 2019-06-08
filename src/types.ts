export type CardId = string;
export type GameId = string;
export type UserId = string;
export type HintNumber = number;

export type ReduxState = any;

export interface SET_PAGEAction {page: Page};
export interface SET_CARD_FLIPPEDAction {};
export interface PICK_ROLEAction {team: Team, role: Role};
export interface SET_TIMEAction {};
export interface TOGGLE_TITLEAction {};
export interface ERROR_OCCUREDAction {text: string, severity: Severity};
export interface DISMISS_ERRORAction {};
export interface SET_WSAction {ws: any};
export interface SET_USERNAMEAction {username: string};
export interface SET_EDITINGAction {flag: boolean};
export interface UPDATE_USER_LISTAction {};
export interface UPDATE_REMOTE_STATEAction {remoteState: any};
export interface ADD_USERAction {};
export interface REMOVE_USERAction {};
export interface UPDATE_USERNAMEAction {};
export interface UPDATE_HINTAction {hint: string};
export interface START_TIMERAction {};
export interface UPDATE_HINT_NUMBERAction {hintNumber: HintNumber};
export interface NEXT_TURNAction {};
export interface FORFEITAction {};
export interface STOP_TIMERAction {};
export interface NEW_GAMEAction {};
export interface EMIT_ACTIONAction {};
export interface SET_SERVER_USERNAMEAction {};
export interface LISTEN_TO_WEBSOCKETAction {};
export interface CHANGE_BACKGROUND_COLORAction {};
export interface SUBMIT_HINTAction {};
export interface FLIP_CARDAction {};
export interface NEW_GAME_2Action {};
export interface SET_USER_IDAction {userId: string};
export interface SET_GAME_IDSAction {gameIds: string[]};
export interface SET_GAME_IDAction {gameId: string};
export interface JOIN_GAMEAction {};
export interface CONNECT_TO_SERVERAction {};
export interface UPDATE_SERVER_ADDRESSAction {serverAddress: string};
export interface SET_CONNECTEDAction {flag: boolean};

export type Action =
  {type: ActionType.SET_PAGE, action: SET_PAGEAction} |
  {type: ActionType.SET_CARD_FLIPPED, action: SET_CARD_FLIPPEDAction} |
  {type: ActionType.PICK_ROLE, action: PICK_ROLEAction} |
  {type: ActionType.SET_TIME, action: SET_TIMEAction} |
  {type: ActionType.TOGGLE_TITLE, action: TOGGLE_TITLEAction} |
  {type: ActionType.ERROR_OCCURED, action: ERROR_OCCUREDAction} |
  {type: ActionType.DISMISS_ERROR, action: DISMISS_ERRORAction} |
  {type: ActionType.SET_WS, action: SET_WSAction} |
  {type: ActionType.SET_USERNAME, action: SET_USERNAMEAction} |
  {type: ActionType.SET_EDITING, action: SET_EDITINGAction} |
  {type: ActionType.UPDATE_USER_LIST, action: UPDATE_USER_LISTAction} |
  {type: ActionType.UPDATE_REMOTE_STATE, action: UPDATE_REMOTE_STATEAction} |
  {type: ActionType.ADD_USER, action: ADD_USERAction} |
  {type: ActionType.REMOVE_USER, action: REMOVE_USERAction} |
  {type: ActionType.UPDATE_USERNAME, action: UPDATE_USERNAMEAction} |
  {type: ActionType.UPDATE_HINT, action: UPDATE_HINTAction} |
  {type: ActionType.START_TIMER, action: START_TIMERAction} |
  {type: ActionType.UPDATE_HINT_NUMBER, action: UPDATE_HINT_NUMBERAction} |
  {type: ActionType.NEXT_TURN, action: NEXT_TURNAction} |
  {type: ActionType.FORFEIT, action: FORFEITAction} |
  {type: ActionType.STOP_TIMER, action: STOP_TIMERAction} |
  {type: ActionType.NEW_GAME, action: NEW_GAMEAction} |
  {type: ActionType.EMIT_ACTION, action: EMIT_ACTIONAction} |
  {type: ActionType.SET_SERVER_USERNAME, action: SET_SERVER_USERNAMEAction} |
  {type: ActionType.LISTEN_TO_WEBSOCKET, action: LISTEN_TO_WEBSOCKETAction} |
  {type: ActionType.CHANGE_BACKGROUND_COLOR, action: CHANGE_BACKGROUND_COLORAction} |
  {type: ActionType.SUBMIT_HINT, action: SUBMIT_HINTAction} |
  {type: ActionType.FLIP_CARD, action: FLIP_CARDAction} |
  {type: ActionType.NEW_GAME_2, action: NEW_GAME_2Action} |
  {type: ActionType.SET_USER_ID, action: SET_USER_IDAction} |
  {type: ActionType.SET_GAME_IDS, action: SET_GAME_IDSAction} |
  {type: ActionType.SET_GAME_ID, action: SET_GAME_IDAction} |
  {type: ActionType.JOIN_GAME, action: JOIN_GAMEAction} |
  {type: ActionType.CONNECT_TO_SERVER, action: CONNECT_TO_SERVERAction} |
  {type: ActionType.UPDATE_SERVER_ADDRESS, action: UPDATE_SERVER_ADDRESSAction} |
  {type: ActionType.SET_CONNECTED, action: SET_CONNECTEDAction}

export enum ActionType {
  SET_PAGE = 'set page',

  SET_CARD_FLIPPED = 'flip this card',
  PICK_ROLE = 'change role',
  SET_TIME = 'set time',
  TOGGLE_TITLE = 'toggle title',
  ERROR_OCCURED = 'an error has occured',
  DISMISS_ERROR = 'dismiss error',
  SET_WS = 'set ws',
  SET_USERNAME = 'set username',
  SET_EDITING = 'set editing',
  UPDATE_USER_LIST = 'update user list',
  UPDATE_REMOTE_STATE = 'update remote state',
  ADD_USER = 'server add user',
  REMOVE_USER = 'server remove user',
  UPDATE_USERNAME = 'server update username',
  UPDATE_HINT = 'update hint',
  START_TIMER = 'async start timer',
  UPDATE_HINT_NUMBER = 'update hint number',
  NEXT_TURN = 'next turn',
  FORFEIT = 'forfeit',
  STOP_TIMER = 'async stop timer',
  NEW_GAME = 'async new game',
  EMIT_ACTION = 'async emit',
  SET_SERVER_USERNAME = 'async set server username',
  LISTEN_TO_WEBSOCKET = 'async listen to websocket',
  CHANGE_BACKGROUND_COLOR = 'async change backgroundColor',
  SUBMIT_HINT = 'async submit hint',
  FLIP_CARD = 'async flip card',
  NEW_GAME_2 = 'async new game 2',
  SET_USER_ID = 'set user id',
  SET_GAME_IDS = 'set game ids',
  SET_GAME_ID = 'set game id',
  JOIN_GAME = 'async join game',
  CONNECT_TO_SERVER = 'async connect to server',
  UPDATE_SERVER_ADDRESS = 'update server address',
  SET_CONNECTED = 'set connected',
}

export enum Page {
  
}

export enum Team {
  TEAM_1 = 'team1',
  TEAM_2 = 'team2',
}

export enum Role {
  SPYMASTER = 'spymaster',
  AGENT = 'spymaster'
}

export enum Severity {
  
}
