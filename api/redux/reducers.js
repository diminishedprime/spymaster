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
import paths from '../../src/redux/paths.js'
import R from 'ramda'

const addUser = (state, {user}) => {
  const userId = user.userId
  return R.compose(
    R.over(paths.userListPath, R.append(userId)),
    R.over(paths.usersPath, R.append(user))
  )(state)
}

const removeUser = (state, {user}) => {
  const userId = user.userId
  const userIds = R.view(paths.userListPath, state)
  const users = R.view(paths.usersPath, state)
  const userIdIdx = userIds.indexOf(userId)
  const userIdx = users.indexOf(user)
  return R.compose(
    R.over(paths.userListPath, R.remove(userIdIdx, 1)),
    R.over(paths.usersPath, R.remove(userIdx, 1))
  )(state)
}

const otherTeam = (team) => team === '1' ? '2' : '1'

const changeColor = (state, {team, color}) => {
  const otherTeamsColor = R.view(paths.backgroundColorPath(otherTeam(team)), state)
  return (color !== otherTeamsColor)
    ? R.set(paths.backgroundColorPath(team), color, state)
    : state
}

const updateUsername = (state, {user, username}) => {
  const users = R.view(paths.usersPath, state)
  const userIds = R.view(paths.userListPath, state)

  const userIdx = users.indexOf(user)
  const userIdIdx = userIds.indexOf(user.userId)

  return R.compose(
    R.set(paths.userListUserPath(userIdIdx), username),
    R.set(paths.usersUserUsernamePath(userIdx), R.remove(userIdx, 1))
  )(state)
}

const nextTurn = (state) => R.compose(
  R.set(paths.timePath, undefined),
  R.over(paths.currentTeamPath, otherTeam),
  R.set(paths.hintPath, initialHint)
)(state)

const loseGame = (state, {team}) => {
  /* Implement actual game over logic team is the team that lost this makes it
     easy to do forfeit logic, if it is undefined, then the currentTeam just lost
   */

  // console.log('someone lost')
  return state
}

const checkAssassin = (id) => (state) => {
  const cardTeam = R.view(paths.cardsTeamPath(id), state)
  return (cardTeam === 'assassin')
    ? loseGame(state)
    : state
}

const checkCorrectCard = (id) => (state) => {
  const currentTeam = R.view(paths.currentTeamPath, state)
  const cardTeam = R.view(paths.cardsTeamPath(id), state)
  return (currentTeam === cardTeam)
    ? state
    : nextTurn(state)
}

const decreaseGuesses = (state) => {
  const numGuesses = R.view(paths.hintNumberPath, state)
  // If they explicitly picked 'inf' or '0', they infinite guesses
  if (numGuesses === 'inf' || numGuesses === '0') {
    return state
  }

  const asNumber = parseInt(numGuesses) - 1
  if (asNumber === 0) {
    return nextTurn(state)
  } else {
    return R.set(paths.hintNumberPath, asNumber + '', state)
  }
}

const flipCard = (state, {id}) => {
  const cards = R.view(paths.cardsPath, state)
  const cardIdx = R.findIndex((card) => card.id === id, cards)

  return R.compose(
    checkAssassin(cardIdx),
    checkCorrectCard(cardIdx),
    decreaseGuesses,
    R.set(paths.cardsFlippedPath(cardIdx), true)
  )(state)
}

const submitHint = (state, _) =>
  R.set(paths.hintSubmittedPath, true, state)

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
