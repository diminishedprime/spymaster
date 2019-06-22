import { Dispatch as ReduxDispatch } from "redux";
import * as ta from "typesafe-actions";
import * as fp from "fp-ts";
import * as m from "monocle-ts";
import * as ro from "redux-observable";

export type CardId = string;
export type GameId = string;
export type UserId = string | undefined;
export type HintNumber = number | "Zero" | "Infinity";

export interface SetPage {
  type: ActionType.SET_PAGE;
  page: Page;
}
export interface SetCardFlipped {
  type: ActionType.SET_CARD_FLIPPED;
  cardId: CardId;
}
export interface PickRole {
  type: ActionType.PICK_ROLE;
  team: Team;
  role: Role;
}
export interface SetTime {
  type: ActionType.SET_TIME;
  seconds: number;
}
export interface ToggleTitle {
  type: ActionType.TOGGLE_TITLE;
}
export interface ErrorOccured {
  type: ActionType.ERROR_OCCURED;
  text: string;
  severity: Severity;
}
export interface DimissError {
  type: ActionType.DISMISS_ERROR;
}
export interface SetWs {
  type: ActionType.SET_WS;
  ws: any;
}
export interface SetUsername {
  type: ActionType.SET_USERNAME;
  username: string;
}
export interface SetEditing {
  type: ActionType.SET_EDITING;
  flag: boolean;
}
export interface UpdateUserList {
  type: ActionType.UPDATE_USER_LIST;
}
export interface UpdateRemoteState {
  type: ActionType.UPDATE_REMOTE_STATE;
  remoteState: any;
}
export interface AddUser {
  type: ActionType.ADD_USER;
  userId: UserId;
  ws: any;
}
export interface RemoveUser {
  type: ActionType.REMOVE_USER;
  userId: UserId;
}
export interface UpdateUsername {
  type: ActionType.UPDATE_USERNAME;
}
export interface UpdateHint {
  type: ActionType.UPDATE_HINT;
  hint: string;
}
export interface StartTimer {
  type: ActionType.START_TIMER;
}
export interface UpdateHintNumber {
  type: ActionType.UPDATE_HINT_NUMBER;
  hintNumber: HintNumber;
}
export interface NextTurn {
  type: ActionType.NEXT_TURN;
}
export interface Forfeit {
  type: ActionType.FORFEIT;
  team: Team;
}
export interface StopTimer {
  type: ActionType.STOP_TIMER;
}
export interface NewGame {
  type: ActionType.NEW_GAME;
}
export interface EmitAction {
  type: ActionType.EMIT_ACTION;
}
export interface SetServerUsername {
  type: ActionType.SET_SERVER_USERNAME;
  username: string;
}
export interface ListenToWebsocket {
  type: ActionType.LISTEN_TO_WEBSOCKET;
}
export interface ChangeBackgroundColor {
  type: ActionType.CHANGE_BACKGROUND_COLOR;
  team: Team;
  backgroundColor: string;
}
export interface SubmitHint {
  type: ActionType.SUBMIT_HINT;
}
export interface FlipCard {
  type: ActionType.FLIP_CARD;
  cardId: CardId;
}
export interface NewGame2 {
  type: ActionType.NEW_GAME_2;
}
export interface SetUserId {
  type: ActionType.SET_USER_ID;
  userId: UserId;
}
export interface SetGameIds {
  type: ActionType.SET_GAME_IDS;
  gameIds: GameId[];
}
export interface SetGameId {
  type: ActionType.SET_GAME_ID;
  gameId: GameId;
}
export interface JoinGame {
  type: ActionType.JOIN_GAME;
  userId: UserId;
  gameId: GameId;
}
export interface ConnectToServer {
  type: ActionType.CONNECT_TO_SERVER;
  serverAddress: string;
}
export interface UpdateServerAddress {
  type: ActionType.UPDATE_SERVER_ADDRESS;
  serverAddress: string;
}
export interface SetConnected {
  type: ActionType.SET_CONNECTED;
  flag: boolean;
}

export interface ToServer {
  type: ActionType.TO_SERVER;
  action: ServerAction;
}

export type ServerAction = any;

export type Action =
  | ToServer
  | SetPage
  | SetCardFlipped
  | PickRole
  | SetTime
  | ToggleTitle
  | ErrorOccured
  | DimissError
  | SetWs
  | SetUsername
  | SetEditing
  | UpdateUserList
  | UpdateRemoteState
  | AddUser
  | RemoveUser
  | UpdateUsername
  | UpdateHint
  | StartTimer
  | UpdateHintNumber
  | NextTurn
  | Forfeit
  | StopTimer
  | NewGame
  | EmitAction
  | SetServerUsername
  | ListenToWebsocket
  | ChangeBackgroundColor
  | SubmitHint
  | FlipCard
  | NewGame2
  | SetUserId
  | SetGameIds
  | SetGameId
  | JoinGame
  | ConnectToServer
  | UpdateServerAddress
  | SetConnected;

export enum ActionType {
  TO_SERVER = "async server action",
  SET_PAGE = "set page",

  SET_CARD_FLIPPED = "flip this card",
  PICK_ROLE = "change role",
  SET_TIME = "set time",
  TOGGLE_TITLE = "toggle title",
  ERROR_OCCURED = "an error has occured",
  DISMISS_ERROR = "dismiss error",
  SET_WS = "set ws",
  SET_USERNAME = "set username",
  SET_EDITING = "set editing",
  UPDATE_USER_LIST = "update user list",
  UPDATE_REMOTE_STATE = "update remote state",
  ADD_USER = "server add user",
  REMOVE_USER = "server remove user",
  UPDATE_USERNAME = "server update username",
  UPDATE_HINT = "update hint",
  START_TIMER = "async start timer",
  UPDATE_HINT_NUMBER = "update hint number",
  NEXT_TURN = "next turn",
  FORFEIT = "forfeit",
  STOP_TIMER = "async stop timer",
  NEW_GAME = "async new game",
  EMIT_ACTION = "async emit",
  SET_SERVER_USERNAME = "async set server username",
  LISTEN_TO_WEBSOCKET = "async listen to websocket",
  CHANGE_BACKGROUND_COLOR = "async change backgroundColor",
  SUBMIT_HINT = "async submit hint",
  FLIP_CARD = "async flip card",
  NEW_GAME_2 = "async new game 2",
  SET_USER_ID = "set user id",
  SET_GAME_IDS = "set game ids",
  SET_GAME_ID = "set game id",
  JOIN_GAME = "async join game",
  CONNECT_TO_SERVER = "async connect to server",
  UPDATE_SERVER_ADDRESS = "update server address",
  SET_CONNECTED = "set connected"
}

export enum Page {
  GAME_MODE_PICK_TEAM = "pick team",
  LOBBY = "lobby",
  GAME_MODE_GAME = "game mode game"
}

export enum Team {
  TEAM_1 = "team1",
  TEAM_2 = "team2",
  ASSASSIN = "assassin",
  BYSTANDER = "bystander"
}

export interface Card {
  text: string;
  flipped: boolean;
  id: CardId;
  team: Team;
}

export enum Role {
  SPYMASTER = "spymaster",
  AGENT = "spymaster"
}

export enum Severity {
  ERROR = "error",
  WARN = "warn"
}

interface Settings {
  showTitle: boolean;
}

export interface Error {
  text: string;
  severity: Severity;
}

interface PlayerType {
  team: Team;
  role: Role;
}
export interface LocalState {
  ws: any;
  userId: UserId;
  connected: boolean;
  serverAddress: string;
  username: string;
  settings: Settings;
  error: fp.option.Option<Error>;
  page: Page;
  playerType: PlayerType;
  gameIds: GameId[];
  gameId?: GameId;
}
interface Score {
  [Team.TEAM_1]: number;
  [Team.TEAM_2]: number;
}

interface Hint {
  text: string;
  number: HintNumber;
  submitted: boolean;
}

export type Cards = { [cardId: string]: Card };

export interface Style {
  [Team.TEAM_1]: React.CSSProperties;
  [Team.TEAM_2]: React.CSSProperties;
  [Team.ASSASSIN]: React.CSSProperties;
  [Team.BYSTANDER]: React.CSSProperties;
}

export interface RemoteState {
  winner: fp.option.Option<Team>;
  time: number;
  score: Score;
  hint: Hint;
  cards: Cards;
  style: Style;
  clientUsers: string[];
  currentTeam: Team;
}

export interface ReduxState {
  localState: LocalState;
  remoteState: fp.option.Option<RemoteState>;
}

export interface Api {
  dismissError: () => void;
  changeUsername: (username: string) => void;
  joinGame: (gameId: GameId, userId: UserId) => void;
  pickRole: (team: Team, role: Role) => void;
  setBackgroundColor: (team: Team, color: string) => void;
  connectToServer: (serverAddress: string) => void;
  newGame: () => void;
}

export const lens = (() => {
  const reduxStateFP = m.Lens.fromProp<ReduxState>();
  const reduxStateFOP = m.Optional.fromOptionProp<ReduxState>();
  const localStateFP = m.Lens.fromProp<LocalState>();
  const remoteStateFP = m.Lens.fromProp<RemoteState>();
  const playerTypeFP = m.Lens.fromProp<PlayerType>();
  const cardFP = m.Lens.fromProp<Card>();

  const localStateL = reduxStateFP("localState");
  const remoteStateL = reduxStateFOP("remoteState");
  const playerTypeL = localStateL.compose(localStateFP("playerType"));

  const playerType = {
    team: playerTypeL.compose(playerTypeFP("team")),
    role: playerTypeL.compose(playerTypeFP("role"))
  };

  const localState = {
    ws: localStateL.compose(localStateFP("ws")),
    userId: localStateL.compose(localStateFP("userId")),
    connected: localStateL.compose(localStateFP("connected")),
    serverAddress: localStateL.compose(localStateFP("serverAddress")),
    username: localStateL.compose(localStateFP("username")),
    settings: localStateL.compose(localStateFP("settings")),
    error: localStateL.compose(localStateFP("error")),
    page: localStateL.compose(localStateFP("page")),
    playerType,
    gameIds: localStateL.compose(localStateFP("gameIds")),
    gameId: localStateL.compose(localStateFP("gameId"))
  };

  const remoteState = {
    winner: remoteStateL.compose(remoteStateFP("winner").asOptional()),
    time: remoteStateL.compose(remoteStateFP("time").asOptional()),
    score: remoteStateL.compose(remoteStateFP("score").asOptional()),
    hint: remoteStateL.compose(remoteStateFP("hint").asOptional()),
    cards: {
      l: remoteStateL.compose(remoteStateFP("cards").asOptional()),
      idx: (i: number) => {
        const cardsLens = remoteStateL.compose(
          remoteStateFP("cards")
            .asOptional()
            .compose(
              new m.Lens(
                (a: Cards) => a[i],
                (c: Card) => (cs: Cards) => ({ ...cs, [c.id]: c })
              ).asOptional()
            )
        );
        const card = {
          text: cardsLens.compose(cardFP("text").asOptional())
        };

        return {
          card: cardsLens,
          ...card
        };
      }
    },
    style: remoteStateL.compose(remoteStateFP("style").asOptional()),
    clientUsers: remoteStateL.compose(
      remoteStateFP("clientUsers").asOptional()
    ),
    currentTeam: remoteStateL.compose(remoteStateFP("currentTeam").asOptional())
  };

  return {
    reduxState: {
      localState,
      remoteState
    }
  };
})();

export type RootAction = ta.ActionType<typeof import("./redux/actions")>;

declare module "typesafe-actions" {
  interface Types {
    RootAction: RootAction;
  }
}

export interface ReduxState2 {
  socket: Option<SocketIOClient.Socket>;
}

export type Dispatch = ReduxDispatch<RootAction>;
export type Option<T> = fp.option.Option<T>;
export type Epic = ro.Epic<RootAction, RootAction, ReduxState2>;

export const none = fp.option.none;
export const some = fp.option.some;
export const fromNullable = fp.option.fromNullable;
