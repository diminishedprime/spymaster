import watchReplay from './replay-saga.js'
import watchConnectToWebsocket from './connect-to-websocket.js'
import retrieveHi from './retrieve-hi.js'
import incrementAsync from './incrementAsync.js'
import { all } from 'redux-saga/effects'

export const rootSaga = function* () {
  yield all([
    incrementAsync(),
    retrieveHi(),
    watchReplay(),
    watchConnectToWebsocket(),
  ])
}
