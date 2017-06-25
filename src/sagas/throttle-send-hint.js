import { delay } from 'redux-saga'
import { takeLatest, put } from 'redux-saga/effects'
import { UPDATE_HINT } from '../redux/actions.js'
import { afEmitAction } from './connect-to-websocket.js'

const throttleSendHint = function* (action) {
  yield delay(500)
  yield put(afEmitAction(action))
}

export default function* () {
  yield takeLatest(UPDATE_HINT, throttleSendHint)
}
