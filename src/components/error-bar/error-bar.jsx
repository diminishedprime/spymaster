import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import {
  afDismissError,
} from '../../redux/actions.js'
import {
  errorPath,
} from '../../redux/paths.js'

const errorBarStyle = ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '2em',
  padding: '5px',
})

const errorStyle = ({
  backgroundColor: '#DE0707',
  color: 'white',
})

const warnStyle = ({
  backgroundColor: '#FFDD00',
  color: 'black',
})

const dismissStyle = ({
  cursor: 'pointer',
  marginLeft: 'auto',
})

const ErrorBar = ({text, severity, dismiss}) => (
  <div style={R.merge(errorBarStyle,
                      R.cond([
                        [R.equals('error'), R.always(errorStyle)],
                        [R.equals('warn'), R.always(warnStyle)],
                      ])(severity))}>
    <div>{text}</div>
    <div style={dismissStyle} onClick={dismiss} title="dismiss">&times;</div>
  </div>

)
const mapStateToProps = (state) => {
  const error = R.view(errorPath, state)
  return ({
    ...error,
  })
}

const mapDispatchToProps = (dispatch) => ({
  dismiss: () => dispatch(afDismissError()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorBar)
