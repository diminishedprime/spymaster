import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import {
  afForfeit,
} from '../../redux/actions.js'
import {
  afEmitAction,
} from '../../redux/sagas/connect-to-websocket.js'
import {
  teamPath,
} from '../../redux/paths.js'

const Forfeit = connect(
  (state) => ({team: R.view(teamPath, state)}),
  (dispatch) => ({
    forfeit: (team) => () => dispatch(afEmitAction(afForfeit(team))),
  })
)(({team, forfeit}) => (
  <button onClick={forfeit(team)}>Forfeit</button>
))

export default Forfeit
