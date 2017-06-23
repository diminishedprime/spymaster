import { delay } from 'redux-saga'
import { afIncrementCounter } from '../redux.js'
import { put, takeEvery } from 'redux-saga/effects'

const ASYNC_INCREMENT_COUNTER = 'async increment counter'
export const afAsyncIncrementCounter = () => ({
  type: ASYNC_INCREMENT_COUNTER,
})

const incrementAysnc = function* () {
  yield delay(1000)
  yield put(afIncrementCounter())
}

export default function* () {
  yield takeEvery(ASYNC_INCREMENT_COUNTER, incrementAysnc)
}
