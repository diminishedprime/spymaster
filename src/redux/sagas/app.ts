import * as t from "../../types";
import { afEmitAction } from "../actions";

import { all, takeEvery, put } from "redux-saga/effects";

const updateHintNumber = function*() {
  yield takeEvery(t.ActionType.UPDATE_HINT_NUMBER, function*(action) {
    yield put(afEmitAction(action));
  });
};

const changeBackgroundColor = function*() {
  yield takeEvery(t.ActionType.CHANGE_BACKGROUND_COLOR, function*(action) {
    yield put(afEmitAction(action));
  });
};

const startTimer = function*() {
  yield takeEvery(t.ActionType.START_TIMER, function*(action) {
    yield put(afEmitAction(action));
  });
};

const flipCard = function*() {
  yield takeEvery(t.ActionType.FLIP_CARD, function*(action) {
    yield put(afEmitAction(action));
  });
};

const forfeit = function*() {
  yield takeEvery(t.ActionType.FORFEIT, function*(action) {
    yield put(afEmitAction(action));
  });
};

const submitHint = function*() {
  yield takeEvery(t.ActionType.SUBMIT_HINT, function*(action) {
    yield put(afEmitAction(action));
  });
};

const nextTurn = function*() {
  yield takeEvery(t.ActionType.NEXT_TURN, function*(action) {
    yield put(afEmitAction(action));
  });
};

const toServer = function*() {
  yield takeEvery(t.ActionType.TO_SERVER, function*(action: t.ToServer) {
    yield put(afEmitAction(action.action));
  });
};

export default function*() {
  yield all([
    toServer(),
    updateHintNumber(),
    nextTurn(),
    submitHint(),
    forfeit(),
    flipCard(),
    changeBackgroundColor(),
    startTimer()
  ]);
}
