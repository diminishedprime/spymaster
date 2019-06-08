import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import {
  currentTeamPath,
  teamPath,
}from '../../redux/paths'
import {
  afNextTurn,
} from '../../redux/actions'

const mapStateToProps = (state) => {
  const playerTeam = R.view(teamPath, state)
  const currentTeam = R.view(currentTeamPath, state)
  const disabled = playerTeam !== currentTeam

  return ({
    disabled,
  })
}

const mapDispatchToProps = (dispatch) => ({
  pass: () => dispatch(afNextTurn()),
})

const Pass = ({pass, disabled}) => (
  <button disabled={disabled}
          onClick={pass}>
    Pass Turn
  </button>
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pass)
