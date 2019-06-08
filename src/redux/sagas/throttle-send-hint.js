import {
  delay,
} from 'redux-saga'

import {
  UPDATE_HINT,
  afEmitAction,
} from '../actions'

import {
  takeLatest,
  put,
} from 'redux-saga/effects'

const throttleSendHint = function* (action) {
  yield delay(500)
  yield put(afEmitAction(action))
}

export default function* () {
  yield takeLatest(UPDATE_HINT, throttleSendHint)
}
