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

import './error-bar.css'

const ErrorBar = ({text, severity, dismiss}) => (
  <div className={['errorBar', severity].join(' ')}>
    <div>{text}</div>
    <div className="dismiss" onClick={dismiss} title="dismiss">&times;</div>
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
