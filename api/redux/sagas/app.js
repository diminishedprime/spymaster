import R from 'ramda'
import uuid4 from 'uuid/v4'

import {
  newGame,
} from '../initial-state'
import {
  afJoinGame,
  CHANGE_BACKGROUND_COLOR,
  JOIN_GAME,
  afSetGameId,
  afSetGameIds,
  NEW_GAME_2,
  afSetUserId,
  FLIP_CARD,
  START_TIMER,
  STOP_TIMER,
  afStopTimer,
  afSetTime,
  afNextTurn,
  afSetCardFlipped,
  afUpdateHintNumber,
  afForfeit,
  NEXT_TURN,
  afUpdateRemoteState,
  afSetUsername,
  afSetPage,
} from '../../../src/redux/actions'
import {
  GAME_MODE_PICK_TEAM,
  TEAM_1,
  TEAM_2,
  ASSASSIN,
  INF,
  ZERO,
} from '../../../src/constants'
import {
  cardTeamByCardId,
  cardsPath,
  currentTeamPath,
  hintNumberPath,
} from '../../../src/redux/paths'
import {
  afRemoveUser,
  afChangeBackgroundColorServer,
  afJoinGameServer,
  afBroadcastActionToUserIds,
  afBroadcastActionToUserId,
  afBroadcastActionToAll,
  USER_DISCONNECTED,
  USER_CONNECTED,
  afNewGameServer,
  afRemoveUserFromGame,
} from '../actions'
import {
  gamesPath,
  gameUsersPath,
  gameByGameIdPath as gameByGameId,
} from '../paths'

import {
  put,
  all,
  takeEvery,
  race,
  take,
  call,
  select,
} from 'redux-saga/effects'

const pushGameState = function* (gameId) {
  const remoteState = yield select(R.view(gameByGameId(gameId)))
  const remoteStateAction = afUpdateRemoteState(remoteState)
  const userIds = R.view(gameUsersPath, remoteState)
  yield put(afBroadcastActionToUserIds(userIds, remoteStateAction))
}

const wait = (millis) => (
  new Promise((resolve) => {
    setTimeout(() => resolve(), millis)
  })
)

const removeUserFromGame = function* (gameId, userId) {
  const game = yield select(R.view(gameByGameId(gameId)))
  const gameUserIds = R.view(gameUsersPath, game)
  if (gameUserIds.indexOf(userId) > -1) {
    yield put(afRemoveUserFromGame(gameId, userId))
    yield pushGameState(gameId)

  }
}

const userDisconnected = function* () {
  yield takeEvery(USER_DISCONNECTED, function* ({userId}) {
    yield put(afRemoveUser(userId))
    const gameIds = yield select(R.compose(R.keys,R.view(gamesPath)))
    for (let i = 0; i < gameIds.length; i++) {
      const gameId = gameIds[i]
      yield removeUserFromGame(gameId, userId)
    }
  })
}

const userConnected = function* () {
  yield takeEvery(USER_CONNECTED, function* ({userId}) {
    const setUsername = afSetUsername(userId.substring(0, 8))
    const setUserId = afSetUserId(userId)
    const gameIds = yield select(R.compose(R.keys,R.view(gamesPath)))
    const setGameIds = afSetGameIds(gameIds)
    yield put(afBroadcastActionToUserId(userId, setGameIds))
    yield put(afBroadcastActionToUserId(userId, setUsername))
    yield put(afBroadcastActionToUserId(userId, setUserId))
    /* yield forceUpdateRemoteState()*/
  })
}

const loseGame = function* (teamThatLost) {
  yield put(afForfeit(teamThatLost))
  yield put(afStopTimer())
  /*yield forceUpdateRemoteState()*/
}

const zeroRemainingCards = (team, cards) => R.compose(
  R.equals(0),
  R.length,
  R.keys,
  R.filter(({flipped}) => !flipped),
  R.filter(({team: cardTeam}) => (cardTeam === team))
)(cards)

const flipCard = function* () {
  yield takeEvery(FLIP_CARD, function* ({cardId}) {
    // Always flip the card, because that's a safe thing to do
    yield put(afSetCardFlipped(cardId))
    /* yield forceUpdateRemoteState()*/

    const state = yield select(R.identity)
    const cards = R.view(cardsPath, state)
    const teamForCard = R.view(cardTeamByCardId(cardId), state)
    const currentTeam = R.view(currentTeamPath, state)

    const correctCard = (currentTeam === teamForCard)
    const pickedAssassin = (teamForCard === ASSASSIN)
    const team1done = zeroRemainingCards(TEAM_1, cards)
    const team2done = zeroRemainingCards(TEAM_2, cards)

    if (pickedAssassin) {
      yield loseGame(currentTeam)
    } else if (team1done) {
      yield loseGame(TEAM_2)
    } else if (team2done) {
      yield loseGame(TEAM_1)
    } else if (correctCard) {
      // decrease the number of guesses if necessary
      const numGuesses = R.view(hintNumberPath, state)
      if (!(numGuesses === INF || numGuesses === ZERO)) {
        const asNumber = parseInt(numGuesses) - 1
        if (asNumber === 0) {
          yield put(afNextTurn())
          yield put(afStopTimer())
          /* yield forceUpdateRemoteState()*/
        } else {
          yield put(afUpdateHintNumber(asNumber + ''))
          /* yield forceUpdateRemoteState()*/
        }
      }
    } else {
      yield put(afStopTimer())
      yield put(afNextTurn())
      /* yield forceUpdateRemoteState()*/
    }
  })
}

const nextTurn = function* () {
  yield takeEvery(NEXT_TURN, function* () {
    yield put(afStopTimer())
  })
}

const timer = function* () {
  yield takeEvery(START_TIMER, function* () {
    let wasStopped = false
    let seconds = 60
    yield put(afSetTime(seconds))
    for (; seconds >= 0; seconds--) {
      const { stopped } = yield race({
        stopped: take(STOP_TIMER),
        tick: call(wait, 1000),
      })
      if (stopped) {
        wasStopped = true
        break
      } else {
        yield put(afSetTime(seconds))
        /* yield forceUpdateRemoteState()*/
      }
    }
    if (!wasStopped) {
      yield put(afNextTurn())
      /* yield forceUpdateRemoteState()*/
    }
  })
}

const joinGame = function* () {
  yield takeEvery(JOIN_GAME, function* ({userId, gameId}) {
    yield put(afJoinGameServer(userId, gameId))

    yield put(afBroadcastActionToUserId(userId, afSetGameId(gameId)))
    yield put(afBroadcastActionToUserId(userId, afSetPage(GAME_MODE_PICK_TEAM)))
    yield pushGameState(gameId)
  })
}

const changeBackgroundColor = function* () {
  yield takeEvery(CHANGE_BACKGROUND_COLOR, function* ({gameId, team, backgroundColor}) {
    yield put(afChangeBackgroundColorServer(gameId, team, backgroundColor))
    yield pushGameState(gameId)
  })
}

const newGameSaga = function* () {
  yield takeEvery(NEW_GAME_2, function* ({userId}) {
    const gameId = uuid4()
    const gameState = newGame()
    yield put(afNewGameServer(gameId, gameState))

    const gameIds = yield select(R.compose(R.keys,R.view(gamesPath)))
    yield put(afBroadcastActionToAll(afSetGameIds(gameIds)))

    yield put(afJoinGame(gameId, userId))
  })
}

export default function* () {
  yield all([
    changeBackgroundColor(),
    joinGame(),
    newGameSaga(),
    userConnected(),
    userDisconnected(),
    nextTurn(),
    timer(),
    flipCard(),
  ])
}
