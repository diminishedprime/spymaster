import React from 'react'
import {
  connect,
} from 'react-redux'

import {
  afEmitAction,
} from '../../sagas/connect-to-websocket.js'
import {
  afNextTurn,
} from '../../redux/actions.js'

const mapDispatchToProps = (dispatch) => ({
  pass: () => dispatch(afEmitAction(afNextTurn())),
})

const Pass = ({pass}) => (
  <button onClick={pass}>Pass Turn</button>
)

export default connect(
  undefined,
  mapDispatchToProps
)(Pass)
