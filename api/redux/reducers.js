import R from 'ramda'

import {
  fgForHex,
} from '../../src/util.js'
import {
  initialHint,
} from '../../src/redux/initial-state.js'
import {
  SET_CARD_FLIPPED,
  UPDATE_HINT,
  SET_TIME,
  UPDATE_HINT_NUMBER,
  SUBMIT_HINT,
  NEXT_TURN,
  FORFEIT,
} from '../../src/redux/actions.js'
import {
  TEAM_1,
  TEAM_2,
} from '../../src/constants.js'
import {
  cardFlippedByCardId,
  winnerPath,
  hintSubmittedPath,
  timePath,
  currentTeamPath,
  hintPath,
  clientUsersPath,
  hintTextPath,
  hintNumberPath,
} from '../../src/redux/paths.js'

import {
  initialState,
} from './initial-state.js'
import {
  backgroundColorForTeamPath,
  foregroundColorForTeamPath,
  gameUsersPath,
  gameByGameIdPath as gameByGameId,
  usersPath,
  userByUserIdPath,
} from './paths.js'
import {
  CHANGE_BACKGROUND_COLOR_SERVER,
  JOIN_GAME_SERVER,
  NEW_GAME_2_SERVER,
  ADD_USER,
  REMOVE_USER,
} from './actions.js'

const addUser = (state, {userId, ws}) => R.compose(
  R.set(userByUserIdPath(userId), {userId, ws}),
  R.over(clientUsersPath, R.assoc(userId, {userId}))
)(state)

const removeUser = (state, {userId}) => R.compose(
  R.over(usersPath, R.dissoc(userId)),
  R.over(clientUsersPath, R.dissoc(userId))
)(state)


const otherTeam = (team) => team === TEAM_1 ? TEAM_2 : TEAM_1

const nextTurn = (state) => R.compose(
  R.set(timePath, undefined),
  R.over(currentTeamPath, otherTeam),
  R.set(hintPath, initialHint)
)(state)

const loseGame = (state, {team}) => {
  return R.set(winnerPath, otherTeam(team), state)
}

const submitHint = (state, _) =>
  R.set(hintSubmittedPath, true, state)

const setCardFlipped = (state, {cardId}) =>
  R.set(cardFlippedByCardId(cardId), true, state)

export const setTime = (state, {seconds}) =>
  R.set(timePath, seconds, state)

export const updateHint = (state, {hint}) =>
  R.set(hintTextPath, hint, state)

export const updateHintNumber = (state, {hintNumber}) =>
  R.set(hintNumberPath, hintNumber, state)

const setNewGame2Server = (_, {gameState}) => gameState

const joinGameServer = (gameState, {userId}) =>
  R.over(gameUsersPath, R.append(userId), gameState)

const setBackgroundColor = (gameState, {team, backgroundColor}) => {
  const foregroundColor = fgForHex(backgroundColor)
  const newState = R.compose(
    R.set(foregroundColorForTeamPath(team), foregroundColor),
    R.set(backgroundColorForTeamPath(team), backgroundColor)
  )(gameState)
  return newState
}

const gameApp = (action) => (gameState) => {
  switch (action.type) {
    case JOIN_GAME_SERVER: return joinGameServer(gameState, action)
    case NEW_GAME_2_SERVER: return setNewGame2Server(gameState, action)
    case CHANGE_BACKGROUND_COLOR_SERVER:
      return setBackgroundColor(gameState, action)
    default: return gameState
  }
}

export const app = (state=initialState, action) => {
  switch(action.type) {
    case CHANGE_BACKGROUND_COLOR_SERVER:
    case NEW_GAME_2_SERVER:
    case JOIN_GAME_SERVER: return R.over(gameByGameId(action.gameId), gameApp(action), state)

    case SET_CARD_FLIPPED: return setCardFlipped(state, action)
    case ADD_USER: return addUser(state, action)
    case REMOVE_USER: return removeUser(state, action)
    case UPDATE_HINT: return updateHint(state, action)
    case SET_TIME: return setTime(state, action)
    case UPDATE_HINT_NUMBER: return updateHintNumber(state, action)
    case SUBMIT_HINT: return submitHint(state, action)
    case NEXT_TURN: return nextTurn(state)
    case FORFEIT: return loseGame(state, action)
    default:
      if (!(
        action.type.startsWith('async') ||
        action.type.startsWith('@@redux')
      )) {
        // eslint-disable-next-line no-console
        console.log(`${action.type} not handled`)
      }
      return state
  }
}
