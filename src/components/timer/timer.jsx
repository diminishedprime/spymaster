import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import {
  afStartTimer,
} from '../../redux/actions.js'
import {
  timePath,
  hintSubmittedPath,
} from '../../redux/paths.js'

import s from './timer.css'

const mapStateToProps = (state) => {
  const time = R.view(timePath, state)
  const hintSubmitted = R.view(hintSubmittedPath, state)
  const disabled = !hintSubmitted
  return ({
    time,
    disabled,
  })
}

const mapDispatchToProps = (dispatch) => ({
  start: () => dispatch(afStartTimer()),
})

const Timer = connect(
  mapStateToProps,
  mapDispatchToProps
)(({time, start, disabled}) => (
  <div className={s.timer}>
    { time ?
      <div>Time Remaining: {time} </div> :
      <button onClick={start}
              disabled={disabled}>Start Timer</button>}
  </div>
))

export default Timer
