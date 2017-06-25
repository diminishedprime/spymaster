import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import {
  afStartTimer,
} from '../../redux/actions.js'
import {
  afEmitAction,
} from '../../sagas/connect-to-websocket.js'
import {
  timePath,
} from '../../redux/paths.js'

import s from './timer.css'


const Timer = connect(
  (state) => ({
    time: R.view(timePath, state),
  }),
  (dispatch) => ({start: () => dispatch(afEmitAction(afStartTimer()))})
)(({time, start}) => (
  <div className={s.timer}>
    { time ?
      <div>Time Remaining: {time} </div> :
      <button onClick={start}>Start Timer</button>}
  </div>
))

export default Timer
