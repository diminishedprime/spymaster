import {
  initialState,
  initialHint,
} from '../../src/redux/initial-state.js'
import {
  FLIP_CARD,
  ADD_USER,
  REMOVE_USER,
  CHANGE_COLOR,
  UPDATE_USERNAME,
  UPDATE_HINT,
  SET_TIME,
  UPDATE_HINT_NUMBER,
  SUBMIT_HINT,
  NEXT_TURN,
  FORFEIT,
} from '../../src/redux/actions.js'
import {
  updateHint,
  setTime,
  updateHintNumber,
} from '../../src/redux/reducers.js'
import {
  TEAM_1,
  TEAM_2,
  ASSASSIN,
  ZERO,
  INF,
} from '../../src/constants.js'
import {
  cardsTeamPath,
  cardsFlippedPath,
  hintSubmittedPath,
  cardsPath,
  userListUserPath,
  hintNumberPath,
  timePath,
  userListPath,
  usersPath,
  backgroundColorPath,
  usersUserUsernamePath,
  currentTeamPath,
  hintPath,
} from '../../src/redux/paths.js'
import R from 'ramda'

const addUser = (state, {user}) => {
  const userId = user.userId
  return R.compose(
    R.over(userListPath, R.append(userId)),
    R.over(usersPath, R.append(user))
  )(state)
}

const removeUser = (state, {user}) => {
  const userId = user.userId
  const userIds = R.view(userListPath, state)
  const users = R.view(usersPath, state)
  const userIdIdx = userIds.indexOf(userId)
  const userIdx = users.indexOf(user)
  return R.compose(
    R.over(userListPath, R.remove(userIdIdx, 1)),
    R.over(usersPath, R.remove(userIdx, 1))
  )(state)
}

const otherTeam = (team) => team === TEAM_1 ? TEAM_2 : TEAM_1

const changeColor = (state, {team, color}) => {
  const otherTeamsColor = R.view(backgroundColorPath(otherTeam(team)), state)
  return (color !== otherTeamsColor)
    ? R.set(backgroundColorPath(team), color, state)
    : state
}

const updateUsername = (state, {user, username}) => {
  const users = R.view(usersPath, state)
  const userIds = R.view(userListPath, state)

  const userIdx = users.indexOf(user)
  const userIdIdx = userIds.indexOf(user.userId)

  return R.compose(
    R.set(userListUserPath(userIdIdx), username),
    R.set(usersUserUsernamePath(userIdx), R.remove(userIdx, 1))
  )(state)
}

const nextTurn = (state) => R.compose(
  R.set(timePath, undefined),
  R.over(currentTeamPath, otherTeam),
  R.set(hintPath, initialHint)
)(state)

const loseGame = (state, {team: _}) => {
  /* Implement actual game over logic team is the team that lost this makes it
     easy to do forfeit logic, if it is undefined, then the currentTeam just lost
   */

  // console.log('someone lost')
  return state
}

const checkAssassin = (id) => (state) => {
  const cardTeam = R.view(cardsTeamPath(id), state)
  return (cardTeam === ASSASSIN)
    ? loseGame(state)
    : state
}

const checkCorrectCard = (id) => (state) => {
  const currentTeam = R.view(currentTeamPath, state)
  const cardTeam = R.view(cardsTeamPath(id), state)
  return (currentTeam === cardTeam)
    ? state
    : nextTurn(state)
}

const decreaseGuesses = (state) => {
  const numGuesses = R.view(hintNumberPath, state)
  // If they explicitly picked 'inf' or '0', they have infinite guesses
  if (numGuesses === INF || numGuesses === ZERO) {
    return state
  }

  const asNumber = parseInt(numGuesses) - 1
  if (asNumber === 0) {
    return nextTurn(state)
  } else {
    return R.set(hintNumberPath, asNumber + '', state)
  }
}

const flipCard = (state, {id}) => {
  const cards = R.view(cardsPath, state)
  const cardIdx = R.findIndex((card) => card.id === id, cards)

  return R.compose(
    checkAssassin(cardIdx),
    checkCorrectCard(cardIdx),
    decreaseGuesses,
    R.set(cardsFlippedPath(cardIdx), true)
  )(state)
}

const submitHint = (state, _) =>
  R.set(hintSubmittedPath, true, state)

export const app = (state=initialState, action) => {
  switch(action.type) {
    case ADD_USER: return addUser(state, action)
    case REMOVE_USER: return removeUser(state, action)
    case CHANGE_COLOR: return changeColor(state, action)
    case UPDATE_USERNAME: return updateUsername(state, action)
    case FLIP_CARD: return flipCard(state, action)
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
