import watchConnectToWebsocket from './connect-to-websocket.js'
import throttleSendHint from './throttle-send-hint.js'
import app from './app.js'

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
