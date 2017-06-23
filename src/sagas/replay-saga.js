import { eventChannel, END} from 'redux-saga'
import { put, takeLatest, takeEvery, select, call, take } from 'redux-saga/effects'
import {
  afResetState,
  afReplaying,
  afAddToActionLog,
  ADD_TO_ACTION_LOG,
  RESET_STATE,
} from '../redux.js'

export const REPLAY_ACTIONS = 'async replay actions'
export const afReplayActions = () => ({
  type: REPLAY_ACTIONS,
})

const baseTime = 100

const replay = (log) =>
  eventChannel((emitter) => {
    const ivs = []
    let finalTime = 0
    log.map(({action}, idx) => {
      const offSet = baseTime * (idx + 1),
            iv = setTimeout(() => emitter(action), offSet)
      finalTime = offSet + baseTime
      ivs.push(iv)
      return null
    })
    setTimeout(() => emitter(END), finalTime)
    return () => ivs.map(clearTimeout)
  })

const replayActions = function* () {
  const actionLog = yield select(({actionLog}) => actionLog)
  yield put(afResetState())
  yield put(afReplaying(true))
  const chan = yield call(replay, actionLog)
  try {
    for (;;) {
      const action = yield take(chan)
      yield put(action)
    }
  } finally {
    yield put(afReplaying(false))
  }
}

const logActions = function* (action) {
  if (action.type !== ADD_TO_ACTION_LOG &&
      action.type !== REPLAY_ACTIONS &&
      action.type !== RESET_STATE) {
    yield put(afAddToActionLog(action))
  }
}

export default function* () {
  yield takeEvery('*', logActions)
  yield takeLatest(REPLAY_ACTIONS, replayActions)
}
