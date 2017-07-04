import R from 'ramda'

import {
  userIdPath,
} from '../paths.js'
import {
  afSetEditing,
  SET_SERVER_USERNAME,
  JOIN_GAME,
  NEW_GAME_2,
  NEW_GAME,
  CHANGE_BACKGROUND_COLOR,
  START_TIMER,
  FLIP_CARD,
  FORFEIT,
  SUBMIT_HINT,
  NEXT_TURN,
  UPDATE_HINT_NUMBER,
  afEmitAction,
} from '../actions.js'

import {
  select,
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

const changeBackgroundColor = function* () {
  yield takeEvery(CHANGE_BACKGROUND_COLOR, function* (action) {
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

const joinGame = function* () {
  yield takeEvery(JOIN_GAME, function* (action) {
    yield put(afEmitAction(action))
  })
}

const newGame2 = function* () {
  yield takeEvery(NEW_GAME_2, function* (action) {
    const userId = yield select(R.view(userIdPath))
    const actionWithUserId = R.assoc('userId', userId, action)
    yield put(afEmitAction(actionWithUserId))
  })
}

const setServerUsername = function* () {
  yield takeEvery(SET_SERVER_USERNAME, function* (action) {
    /* const username = yield select((state) => R.view(usernamePath, state))*/
    yield put(afEmitAction(action))
    yield put(afSetEditing(false))
  })
}

export default function* () {
  yield all([
    setServerUsername(),
    joinGame(),
    newGame2(),
    updateHintNumber(),
    nextTurn(),
    submitHint(),
    forfeit(),
    flipCard(),
    newGame(),
    changeBackgroundColor(),
    startTimer(),
  ])
}
