export type CardId = string;
export type GameId = string;
export type UserId = string;
export type HintNumber = number;

export type ReduxState = any;

export interface SetPage {page: Page};
export interface SetCardFlipped {};
export interface PickRole {team: Team, role: Role};
export interface SetTime {};
export interface ToggleTitle {};
export interface ErrorOccured {text: string, severity: Severity};
export interface DimissError {};
export interface SetWs {ws: any};
export interface SetUsername {username: string};
export interface SetEditing {flag: boolean};
export interface UpdateUserList {};
export interface UpdateRemoteState {remoteState: any};
export interface AddUser {};
export interface RemoveUser {};
export interface UpdateUsername {};
export interface UpdateHint {hint: string};
export interface StartTimer {};
export interface UpdateHintNumber {hintNumber: HintNumber};
export interface NextTurn {};
export interface Forfeit {};
export interface StopTimer {};
export interface NewGame {};
export interface EmitAction {};
export interface SetServerUsername {};
export interface ListenToWebsocket {};
export interface ChangeBackgroundColor {};
export interface SubmitHint {};
export interface FlipCard {};
export interface NewGame2 {};
export interface SetUserId {userId: string};
export interface SetGameIds {gameIds: string[]};
export interface SetGameId {gameId: string};
export interface JoinGame {};
export interface ConnectToServer {};
export interface UpdateServerAddress {serverAddress: string};
export interface SetConnected {flag: boolean};

export type Action =
  {type: ActionType.SET_PAGE, action: SetPage} |
  {type: ActionType.SET_CARD_FLIPPED, action: SetCardFlipped} |
  {type: ActionType.PICK_ROLE, action: PickRole} |
  {type: ActionType.SET_TIME, action: SetTime} |
  {type: ActionType.TOGGLE_TITLE, action: ToggleTitle} |
  {type: ActionType.ERROR_OCCURED, action: ErrorOccured} |
  {type: ActionType.DISMISS_ERROR, action: DimissError} |
  {type: ActionType.SET_WS, action: SetWs} |
  {type: ActionType.SET_USERNAME, action: SetUsername} |
  {type: ActionType.SET_EDITING, action: SetEditing} |
  {type: ActionType.UPDATE_USER_LIST, action: UpdateUserList} |
  {type: ActionType.UPDATE_REMOTE_STATE, action: UpdateRemoteState} |
  {type: ActionType.ADD_USER, action: AddUser} |
  {type: ActionType.REMOVE_USER, action: RemoveUser} |
  {type: ActionType.UPDATE_USERNAME, action: UpdateUsername} |
  {type: ActionType.UPDATE_HINT, action: UpdateHint} |
  {type: ActionType.START_TIMER, action: StartTimer} |
  {type: ActionType.UPDATE_HINT_NUMBER, action: UpdateHintNumber} |
  {type: ActionType.NEXT_TURN, action: NextTurn} |
  {type: ActionType.FORFEIT, action: Forfeit} |
  {type: ActionType.STOP_TIMER, action: StopTimer} |
  {type: ActionType.NEW_GAME, action: NewGame} |
  {type: ActionType.EMIT_ACTION, action: EmitAction} |
  {type: ActionType.SET_SERVER_USERNAME, action: SetServerUsername} |
  {type: ActionType.LISTEN_TO_WEBSOCKET, action: ListenToWebsocket} |
  {type: ActionType.CHANGE_BACKGROUND_COLOR, action: ChangeBackgroundColor} |
  {type: ActionType.SUBMIT_HINT, action: SubmitHint} |
  {type: ActionType.FLIP_CARD, action: FlipCard} |
  {type: ActionType.NEW_GAME_2, action: NewGame2} |
  {type: ActionType.SET_USER_ID, action: SetUserId} |
  {type: ActionType.SET_GAME_IDS, action: SetGameIds} |
  {type: ActionType.SET_GAME_ID, action: SetGameId} |
  {type: ActionType.JOIN_GAME, action: JoinGame} |
  {type: ActionType.CONNECT_TO_SERVER, action: ConnectToServer} |
  {type: ActionType.UPDATE_SERVER_ADDRESS, action: UpdateServerAddress} |
  {type: ActionType.SET_CONNECTED, action: SetConnected}

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
