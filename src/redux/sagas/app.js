import {
  NEW_GAME,
  CHANGE_COLOR,
  START_TIMER,
  FLIP_CARD,
  FORFEIT,
  SUBMIT_HINT,
  NEXT_TURN,
  UPDATE_HINT_NUMBER,
  afEmitAction,
} from '../actions.js'

import {
  all,
  takeEvery,
  put,
} from 'redux-saga/effects'

const updateHintNumber = function* () {
  yield takeEvery(UPDATE_HINT_NUMBER, function* (action) {
    yield put(afEmitAction(action))
  })
}

const newGame = function* () {
  yield takeEvery(NEW_GAME, function* (action) {
    yield put(afEmitAction(action))
  })
}

const changeColor = function* () {
  yield takeEvery(CHANGE_COLOR, function* (action) {
    yield put(afEmitAction(action))
  })
}

const startTimer = function* () {
  yield takeEvery(START_TIMER, function* (action) {
    yield put(afEmitAction(action))
  })
}

const flipCard = function* () {
  yield takeEvery(FLIP_CARD, function* (action) {
    yield put(afEmitAction(action))
  })
}

const forfeit = function* () {
  yield takeEvery(FORFEIT, function* (action) {
    yield put(afEmitAction(action))
  })
}

const submitHint = function* () {
  yield takeEvery(SUBMIT_HINT, function* (action) {
    yield put(afEmitAction(action))
  })
}

const nextTurn = function* () {
  yield takeEvery(NEXT_TURN, function* (action) {
    yield put(afEmitAction(action))
  })
}

export default function* () {
  yield all([
    updateHintNumber(),
    nextTurn(),
    submitHint(),
    forfeit(),
    flipCard(),
    newGame(),
    changeColor(),
    startTimer(),
  ])
}
