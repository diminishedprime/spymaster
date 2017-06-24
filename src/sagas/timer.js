import { eventChannel, END } from 'redux-saga'
import { takeLatest, take, put } from 'redux-saga/effects'
import { afSetTime } from '../redux.js'

const START_TIMER = 'async start timer'
export const afStartTimer = () => ({
  type: START_TIMER,
})

const startTimer = function* () {
  const seconds = 100
  let iv
  const timerChan = eventChannel((emitter) => {
    let remainingSeconds = seconds
    iv = setInterval(
      () => {
        if (remainingSeconds >= 0) {
          emitter(remainingSeconds)
          remainingSeconds--
        } else {
          clearInterval(iv)
          emitter(END)
        }
      },
      1000
    )
    return () => clearInterval(iv)
  })

  try {
    for (;;) {
      const seconds = yield take(timerChan)
      // TODO: this is where I can handle 0 seconds differently
      yield put(afSetTime(seconds))
    }
  } finally {
    clearInterval(iv)
  }
}

export default function* () {
  yield takeLatest(START_TIMER, startTimer)
}
