import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import {
  afStartTimer,
} from '../../redux/actions'
import {
  timePath,
  hintSubmittedPath,
} from '../../redux/paths'

const timerStyle = ({
  display: 'flex',
  justifyContent: 'cente',
})

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
  <div style={timerStyle}>
    { time ?
      <div>Time Remaining: {time} </div> :
      <button onClick={start}
              disabled={disabled}>Start Timer</button>}
  </div>
))

export default Timer
