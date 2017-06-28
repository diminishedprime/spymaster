import R from 'ramda'

import {
  ASSASSIN,
  TEAM_1,
  TEAM_2,
} from '../../../src/constants.js'
import {
  cardsPath,
  currentTeamPath,
  cardsTeamPath,
} from '../../../src/redux/paths.js'
import {
  afSetTime,
  START_TIMER,
  afStopTimer,
  STOP_TIMER,
  afNextTurn,
  FLIP_CARD,
} from '../../../src/redux/actions.js'
import {
  forceUpdateRemoteState,
} from '../../websocket.js'

import {
  select,
  actionChannel,
  call,
  take,
  put,
  race,
} from 'redux-saga/effects'

const wait = (millis) => (
  new Promise((resolve) => {
    setTimeout(() => resolve(), millis)
  })
)

export const runTimer = function* () {
  const channel = yield actionChannel(START_TIMER)

  while(yield take(channel)) {
    let seconds = 60
    for (;;) {
      const { stopped } = yield race({
        stopped: take(STOP_TIMER),
        tick: call(wait, 1000),
      })

      if (!stopped) {
        seconds--
        if (seconds === 0) {
          yield put(afNextTurn())
        } else {
          yield put(afSetTime(seconds))
        }
        forceUpdateRemoteState()
      } else {
        break
      }
    }
  }
}

const willBeNextTurn = function* ({id}) {
  const state = yield select((state) => state)
  const cards = R.view(cardsPath, state)
  const cardIdx = R.findIndex((card) => card.id === id, cards)
  const cardTeam = R.view(cardsTeamPath(cardIdx), state)
  const pickedAssassin = (cardTeam === ASSASSIN)
  const currentTeam = R.view(currentTeamPath, state)
  const incorrectCard = (currentTeam !== cardTeam)
  const team1done = cards
    .filter((card) => (card.team === TEAM_1))
    .filter((card) => !card.fliped)
    .length === 0
  const team2done = cards
    .filter((card) => (card.team === TEAM_2))
    .filter((card) => !card.flipped)
    .length === 0

  return (
    pickedAssassin ||
    incorrectCard ||
    team1done ||
    team2done
  )
}

export const stopTimer = function* () {
  const channel = yield actionChannel(FLIP_CARD)
  let card
  while ((card = yield take(channel))) {
    if (yield willBeNextTurn(card)) {
      yield put(afStopTimer())
    }
  }
}
