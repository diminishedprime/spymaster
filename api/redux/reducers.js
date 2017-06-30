import R from 'ramda'

import {
  initialState,
  initialHint,
  newCards,
  newScore,
  newColors,
} from '../../src/redux/initial-state.js'
import {
  SET_CARD_FLIPPED,
  CHANGE_COLOR,
  UPDATE_HINT,
  SET_TIME,
  UPDATE_HINT_NUMBER,
  SUBMIT_HINT,
  NEXT_TURN,
  FORFEIT,
  NEW_GAME,
} from '../../src/redux/actions.js'
import {
  TEAM_1,
  TEAM_2,
} from '../../src/constants.js'
import {
  cardFlippedByCardId,
  scorePath,
  winnerPath,
  hintSubmittedPath,
  cardsPath,
  timePath,
  backgroundColorPath,
  currentTeamPath,
  hintPath,
  clientUsersPath,
  hintTextPath,
  hintNumberPath,
} from '../../src/redux/paths.js'

import {
  usersPath,
  userByUserIdPath,
} from './paths.js'
import {
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

const changeColor = (state, {team, color}) => {
  const otherTeamsColor = R.view(backgroundColorPath(otherTeam(team)), state)
  return (color !== otherTeamsColor)
       ? R.set(backgroundColorPath(team), color, state)
       : state
}

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

const newGame = (state, _) => {
  return R.compose(
    newColors,
    R.set(winnerPath, undefined),
    R.set(cardsPath, newCards()),
    R.set(scorePath, newScore()),
    R.set(timePath, undefined),
    R.set(hintPath, initialHint)
  )(state)
}

const setCardFlipped = (state, {cardId}) =>
  R.set(cardFlippedByCardId(cardId), true, state)

export const setTime = (state, {seconds}) =>
  R.set(timePath, seconds, state)

export const updateHint = (state, {hint}) =>
  R.set(hintTextPath, hint, state)

export const updateHintNumber = (state, {hintNumber}) =>
  R.set(hintNumberPath, hintNumber, state)

export const app = (state=initialState, action) => {
  switch(action.type) {
    case SET_CARD_FLIPPED: return setCardFlipped(state, action)
    case ADD_USER: return addUser(state, action)
    case REMOVE_USER: return removeUser(state, action)
    case CHANGE_COLOR: return changeColor(state, action)
    case UPDATE_HINT: return updateHint(state, action)
    case SET_TIME: return setTime(state, action)
    case UPDATE_HINT_NUMBER: return updateHintNumber(state, action)
    case SUBMIT_HINT: return submitHint(state, action)
    case NEXT_TURN: return nextTurn(state)
    case FORFEIT: return loseGame(state, action)
    case NEW_GAME: return newGame(state, action)
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
