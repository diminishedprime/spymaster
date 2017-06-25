import watchReplay from './replay-saga.js'
import watchConnectToWebsocket from './connect-to-websocket.js'
import timer from './timer.js'
import throttleSendHint from './throttle-send-hint.js'
import { all } from 'redux-saga/effects'

export const rootSaga = function* () {
  yield all([
    watchReplay(),
    watchConnectToWebsocket(),
    timer(),
    throttleSendHint(),
  ])
}
