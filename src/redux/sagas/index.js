import watchConnectToWebsocket from './connect-to-websocket'
import throttleSendHint from './throttle-send-hint'
import app from './app'

import {
  all,
} from 'redux-saga/effects'

export const rootSaga = function* () {
  yield all([
    app(),
    watchConnectToWebsocket(),
    throttleSendHint(),
  ])
}
