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
} from '../../../src/redux/actions.js'
import {
  TEAM_1,
  TEAM_2,
  ASSASSIN,
  INF,
  ZERO,
} from '../../../src/constants.js'
import {
  cardsTeamPath,
  cardsPath,
  currentTeamPath,
  hintNumberPath,
} from '../../../src/redux/paths.js'
import {
  forceUpdateRemoteState,
} from '../../websocket.js'

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

const loseGame = function* (teamThatLost) {
  yield put(afForfeit(teamThatLost))
  yield put(afStopTimer())
  forceUpdateRemoteState()
}

const flipCard = function* () {
  yield takeEvery(FLIP_CARD, function* ({id}) {
    // Always flip the card, because that's a safe thing to do
    yield put(afSetCardFlipped(id))
    forceUpdateRemoteState()

    const state = yield select(R.identity)
    const cards = R.view(cardsPath, state)
    const cardIdx = R.findIndex((card) => card.id === id, cards)
    const teamForCard = R.view(cardsTeamPath(cardIdx), state)
    const currentTeam = R.view(currentTeamPath, state)

    const correctCard = (currentTeam === teamForCard)
    const pickedAssassin = (teamForCard === ASSASSIN)
    const team1done = cards
      .filter((card) => (card.team === TEAM_1))
      .filter((card) => !card.fliped)
      .length === 0
    const team2done = cards
      .filter((card) => (card.team === TEAM_2))
      .filter((card) => !card.flipped)
      .length === 0

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
          forceUpdateRemoteState()
        } else {
          yield put(afUpdateHintNumber(asNumber + ''))
          forceUpdateRemoteState()
        }
      }
    } else {
      yield put(afStopTimer())
      yield put(afNextTurn())
      forceUpdateRemoteState()
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
        forceUpdateRemoteState()
      }
    }
    if (!wasStopped) {
      yield put(afNextTurn())
      forceUpdateRemoteState()
    }
  })
}

export default function* () {
  yield all([
    nextTurn(),
    timer(),
    flipCard(),
  ])
}
