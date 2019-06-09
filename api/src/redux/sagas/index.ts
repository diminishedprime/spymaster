import app from './app'
import websocket from './websocket'

import {
  all,
} from 'redux-saga/effects'

export const rootSaga = function* () {
  yield all([
    app(),
    websocket(),
  ])
}
