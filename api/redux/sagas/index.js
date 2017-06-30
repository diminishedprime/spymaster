import app from './app.js'

import {
  all,
} from 'redux-saga/effects'

export const rootSaga = function* () {
  yield all([
    app(),
  ])
}
