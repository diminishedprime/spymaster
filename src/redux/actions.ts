import * as t from '../types';

// Actions & Action Creators
export const afSetPage = (page: t.Page) => ({
  type: t.ActionType.SET_PAGE,
  page,
})

export const afSetCardFlipped = (cardId: t.CardId) => ({
  type: t.ActionType.SET_CARD_FLIPPED,
  cardId,
})

export const afPickRole = (team: t.Team, role: t.Role) => ({
  type: t.ActionType.PICK_ROLE,
  team,
  role,
})

export const afSetTime = (seconds: number) => ({
  type: t.ActionType.SET_TIME,
  seconds,
})

export const afToggleTitle = () => ({
  type: t.ActionType.TOGGLE_TITLE,
})

export const afError = (text: string, severity: t.Severity) => ({
  type: t.ActionType.ERROR_OCCURED,
  text,
  severity,
})

export const afDismissError = () => ({
  type: t.ActionType.DISMISS_ERROR,
})

export const afSetWs = (ws: any) => ({
  type: t.ActionType.SET_WS,
  ws,
})

export const afSetUsername = (username: string) => ({
  type: t.ActionType.SET_USERNAME,
  username,
})

export const afSetEditing = (flag=true) => ({
  type: t.ActionType.SET_EDITING,
  flag,
})

export const afUpdateUserList = (users: any) => ({
  type: t.ActionType.UPDATE_USER_LIST,
  users,
})

export const afUpdateRemoteState = (remoteState: any) => ({
  type: t.ActionType.UPDATE_REMOTE_STATE,
  remoteState,
})

export const afAddUser = (user: any) => ({
  type: t.ActionType.ADD_USER,
  user,
})

export const afRemoveUser = (user: any) => ({
  type: t.ActionType.REMOVE_USER,
  user,
})

export const afUpdateUsername = (user: any, username: string) => ({
  type: t.ActionType.UPDATE_USERNAME,
  user,
  username,
})

export const afUpdateHint = (hint: string) => ({
  type: t.ActionType.UPDATE_HINT,
  hint,
})

export const afStartTimer = () => ({
  type: t.ActionType.START_TIMER,
})

export const afUpdateHintNumber = (hintNumber: t.HintNumber) => ({
  type: t.ActionType.UPDATE_HINT_NUMBER,
  hintNumber,
})

export const afNextTurn = () => ({
  type: t.ActionType.NEXT_TURN,
})

export const afForfeit = (team: t.Team) => ({
  type: t.ActionType.FORFEIT,
  team,
})

export const afStopTimer = () => ({
  type: t.ActionType.STOP_TIMER,
})

export const afNewGame = () => ({
  type: t.ActionType.NEW_GAME,
})

export const afEmitAction = (action: any) => ({
  type: t.ActionType.EMIT_ACTION,
  action,
})

export const afSetServerUsername = () => ({
  type: t.ActionType.SET_SERVER_USERNAME,
})

export const afListenToWebsocket = () => ({
  type: t.ActionType.LISTEN_TO_WEBSOCKET,
})

export const afChangeBackgroundColor = (team: t.Team, backgroundColor: string) => ({
  type: t.ActionType.CHANGE_BACKGROUND_COLOR,
  team,
  backgroundColor,
})

export const afSubmitHint = () => ({
  type: t.ActionType.SUBMIT_HINT,
})

export const afFlipCard = (cardId: t.CardId) => ({
  type: t.ActionType.FLIP_CARD,
  cardId,
})


// Newish?
export const afNewGame2 = () => ({
  type: t.ActionType.NEW_GAME_2,
})

export const afSetUserId = (userId: t.UserId) => ({
  type: t.ActionType.SET_USER_ID,
  userId,
})

export const afSetGameIds = (gameIds: Array<t.GameId>) => ({
  type: t.ActionType.SET_GAME_IDS,
  gameIds,
})

export const afSetGameId = (gameId: t.GameId) => ({
  type: t.ActionType.SET_GAME_ID,
  gameId,
})

export const afJoinGame = (gameId: t.GameId, userId: t.UserId) => ({
  type: t.ActionType.JOIN_GAME,
  gameId,
  userId,
})

export const afConnectToServer = (serverAddress: string) => ({
  type: t.ActionType.CONNECT_TO_SERVER,
  serverAddress,
})

export const afUpdateServerAddress = (serverAddress: string) => ({
  type: t.ActionType.UPDATE_SERVER_ADDRESS,
  serverAddress,
})

export const afSetConnected = (flag: boolean) => ({
  type: t.ActionType.SET_CONNECTED,
  flag,
})
