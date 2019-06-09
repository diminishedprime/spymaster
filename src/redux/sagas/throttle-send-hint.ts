import * as t from "../../types";
import { delay } from "redux-saga";

import { afEmitAction } from "../actions";

import { takeLatest, put } from "redux-saga/effects";

const throttleSendHint = function*(action: t.UpdateHint) {
  yield delay(500);
  yield put(afEmitAction(action));
};

export default function*() {
  yield takeLatest(t.ActionType.UPDATE_HINT, throttleSendHint);
}
