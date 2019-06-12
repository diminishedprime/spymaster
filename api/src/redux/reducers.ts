import * as t from "../types";
import R from "ramda";

import { fgForHex } from "../../../src/util";
import { initialHint } from "../../../src/redux/initial-state";
import {
  cardFlippedByCardId,
  winnerPath,
  hintSubmittedPath,
  timePath,
  currentTeamPath,
  hintPath,
  clientUsersPath,
  hintTextPath,
  hintNumberPath
} from "../../../src/redux/paths";

import { initialState } from "./initial-state";
import {
  backgroundColorForTeamPath,
  foregroundColorForTeamPath,
  gameUsersPath,
  gameByGameIdPath as gameByGameId,
  usersPath,
  userByUserIdPath
} from "./paths";

const addUser = (
  state: t.ServerReduxState,
  { userId, ws }: t.ADD_USERAction
) => {
  let s = R.set(userByUserIdPath(userId!), { userId, ws }, state);
  s = R.over(clientUsersPath, R.assoc(userId!, { userId }), s);
  return s;
};

const removeUser = (
  state: t.ServerReduxState,
  { userId }: t.REMOVE_USERAction
) => {
  let s = R.over(usersPath, R.dissoc(userId!), state);
  s = R.over(clientUsersPath, R.dissoc(userId!), s);
  return s;
};

const otherTeam = (team: t.Team) =>
  team === t.Team.TEAM_1 ? t.Team.TEAM_2 : t.Team.TEAM_1;

const nextTurn = (state: t.ServerReduxState) => {
  let s = R.set(timePath, undefined, state);
  s = R.over(currentTeamPath, otherTeam, s);
  s = R.set(hintPath, initialHint, s);
  return s;
};

const loseGame = (state: t.ServerReduxState, { team }: t.Forfeit) => {
  return R.set(winnerPath, otherTeam(team), state);
};

const submitHint = (state: t.ServerReduxState) =>
  R.set(hintSubmittedPath, true, state);

const setCardFlipped = (
  state: t.ServerReduxState,
  { cardId }: t.SetCardFlipped
) => R.set(cardFlippedByCardId(cardId), true, state);

export const setTime = (state: t.ServerReduxState, { seconds }: t.SetTime) =>
  R.set(timePath, seconds, state);

export const updateHint = (state: t.ServerReduxState, { hint }: t.UpdateHint) =>
  R.set(hintTextPath, hint, state);

export const updateHintNumber = (
  state: t.ServerReduxState,
  { hintNumber }: t.UpdateHintNumber
) => R.set(hintNumberPath, hintNumber, state);

const setNewGame2Server = (
  state: t.ServerReduxState,
  { gameId, gameState }: t.NEW_GAME_SERVERAction
) => R.set(gameByGameId(gameId), gameState, state);

const joinGameServer = (gameState: any, { userId }: t.JoinGame) =>
  R.over(gameUsersPath, R.append(userId), gameState);

const setBackgroundColor = (
  gameState: any,
  { team, backgroundColor }: t.ChangeBackgroundColor
) => {
  const foregroundColor = fgForHex(backgroundColor);
  const wFg = R.set(
    foregroundColorForTeamPath(team),
    foregroundColor,
    gameState
  );
  const wBg = R.set(backgroundColorForTeamPath(team), backgroundColor, wFg);
  return wBg;
};

const removeUserFromGame = (gameState: any, { userId }: t.RemoveUser) => {
  const gameUserIds: t.UserId[] = R.view(gameUsersPath, gameState);
  const userIdx = gameUserIds.indexOf(userId);
  return R.over(gameUsersPath, R.remove(userIdx, 1), gameState);
};

const gameApp = (action: any) => (gameState: any) => {
  switch (action.type) {
    case t.ServerActionType.JOIN_GAME_SERVER:
      return joinGameServer(gameState, action);
    case t.ServerActionType.CHANGE_BACKGROUND_COLOR_SERVER:
      return setBackgroundColor(gameState, action);
    case t.ServerActionType.REMOVE_USER_FROM_GAME:
      return removeUserFromGame(gameState, action);
    default:
      return gameState;
  }
};

export const app = (
  state: t.ServerReduxState = initialState,
  action: t.ServerAction | t.Action
) => {
  switch (action.type) {
    case t.ServerActionType.REMOVE_USER_FROM_GAME:
    case t.ServerActionType.CHANGE_BACKGROUND_COLOR_SERVER:
    case t.ServerActionType.JOIN_GAME_SERVER:
      return R.over(gameByGameId(action.gameId), gameApp(action), state);

    case t.ServerActionType.NEW_GAME_SERVER:
      return setNewGame2Server(state, action);
    case t.ActionType.SET_CARD_FLIPPED:
      return setCardFlipped(state, action);
    case t.ServerActionType.ADD_USER:
      return addUser(state, action);
    case t.ServerActionType.REMOVE_USER:
      return removeUser(state, action);
    case t.ActionType.UPDATE_HINT:
      return updateHint(state, action);
    case t.ActionType.SET_TIME:
      return setTime(state, action);
    case t.ActionType.UPDATE_HINT_NUMBER:
      return updateHintNumber(state, action);
    case t.ActionType.SUBMIT_HINT:
      return submitHint(state);
    case t.ActionType.NEXT_TURN:
      return nextTurn(state);
    case t.ActionType.FORFEIT:
      return loseGame(state, action);

    case t.ServerAsyncActionType.CONNECT_WEBSOCKET_SERVER:
    case t.ServerAsyncActionType.USER_CONNECTED:
    case t.ServerAsyncActionType.BROADCAST_ACTION_TO_ALL:
    case t.ServerAsyncActionType.BROADCAST_ACTION_TO_USER_ID:
    case t.ServerAsyncActionType.BROADCAST_ACTION_TO_USER_IDS:
    case t.ServerAsyncActionType.BROADCAST_MESSAGE_TO_ALL:
    case t.ServerAsyncActionType.BROADCAST_MESSAGE_TO_USER_ID:
    case t.ServerAsyncActionType.BROADCAST_MESSAGE_TO_USER_IDS:
      return state;
    default:
      if (!action.type.startsWith("@@redux")) {
        // eslint-disable-next-line no-console
        console.log(`${action.type} not handled`);
      }
      return state;
  }
};
