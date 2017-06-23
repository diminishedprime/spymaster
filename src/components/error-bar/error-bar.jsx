import React from 'react'
import { connect } from 'react-redux'
import { afDismissError } from '../../redux.js'
import './error-bar.css'

const ErrorBar = ({text, severity, dismiss}) => (
  <div className={['errorBar', severity].join(' ')}>
    <div>{text}</div>
    <div className="dismiss" onClick={dismiss} title="dismiss">&times;</div>
  </div>

)
const mapStateToProps = ({error}) => ({
  ...error,
})

const mapDispatchToProps = (dispatch) => ({
  dismiss: () => dispatch(afDismissError()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorBar)
