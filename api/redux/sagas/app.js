import R from 'ramda'

import {
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
} from '../../../src/redux/actions.js'
import {
  TEAM_1,
  TEAM_2,
  ASSASSIN,
  INF,
  ZERO,
} from '../../../src/constants.js'
import {
  cardTeamByCardId,
  cardsPath,
  currentTeamPath,
  hintNumberPath,
  remoteStatePath,
} from '../../../src/redux/paths.js'
import {
  afBroadcastActionToUserId,
  afBroadcastActionToAll,
  USER_CONNECTED,
} from '../actions.js'

import {
  put,
  all,
  takeEvery,
  race,
  take,
  call,
  select,
} from 'redux-saga/effects'

const wait = (millis) => (
  new Promise((resolve) => {
    setTimeout(() => resolve(), millis)
  })
)

const forceUpdateRemoteState = function* () {
  const remoteState = yield select(R.view(remoteStatePath))
  const remoteStateAction = afUpdateRemoteState(remoteState)
  yield put(afBroadcastActionToAll(remoteStateAction))
}

const userConnected = function* () {
  yield takeEvery(USER_CONNECTED, function* ({userId}) {
    const action = afSetUsername(userId)
    yield put(afBroadcastActionToUserId(userId, action))
    yield forceUpdateRemoteState()
  })
}

const loseGame = function* (teamThatLost) {
  yield put(afForfeit(teamThatLost))
  yield put(afStopTimer())
  yield forceUpdateRemoteState()
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
    yield forceUpdateRemoteState()

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
          yield forceUpdateRemoteState()
        } else {
          yield put(afUpdateHintNumber(asNumber + ''))
          yield forceUpdateRemoteState()
        }
      }
    } else {
      yield put(afStopTimer())
      yield put(afNextTurn())
      yield forceUpdateRemoteState()
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
        yield forceUpdateRemoteState()
      }
    }
    if (!wasStopped) {
      yield put(afNextTurn())
      yield forceUpdateRemoteState()
    }
  })
}

export default function* () {
  yield all([
    userConnected(),
    nextTurn(),
    timer(),
    flipCard(),
  ])
}
