import {
  eventChannel,
  END,
} from 'redux-saga'
import {
  takeLatest,
  take,
  put,
} from 'redux-saga/effects'
import {
  afSetTime,
  START_TIMER,
  afNextTurn,
} from '../../src/redux/actions.js'
import {
  forceUpdateRemoteState,
} from '../websocket.js'

const startTimer = function* () {
  const seconds = 60
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
      if (seconds === 0) {
        yield put(afNextTurn())
      } else {
        yield put(afSetTime(seconds))
      }

      forceUpdateRemoteState()
    }
  } finally {
    clearInterval(iv)
  }
}

export default function* () {
  yield takeLatest(START_TIMER, startTimer)
}
