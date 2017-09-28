import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import {
  SPYMASTER,
} from '../../constants.js'
import {
  teamPath,
  styleForTeamPath,
  currentTeamPath,
  rolePath,
} from '../../redux/paths.js'
import { largeTextStyle } from '../commonStyles.js'

import Pass from './pass.jsx'

const teamsStyle = ({
  minWidth: '6.5em',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
})

const teamsRowStyle = ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const infoBabyStyle = ({
  width: '12em',
  marginLeft: '5px',
  marginRight: '5px',
  marginTop: '10px',
})

const Teams = connect(
  (state) => {
    const role = R.view(rolePath, state)
    const currentTeam = R.view(currentTeamPath, state)
    const yourTeam = R.view(teamPath, state)
    const yourTeamStyle = R.view(styleForTeamPath(yourTeam), state)
    const currentTeamStyle = R.view(styleForTeamPath(currentTeam), state)

    return ({
      yourTeam,
      currentTeam,
      currentTeamStyle,
      yourTeamStyle,
      role,
    })
  }
)(({currentTeamStyle, yourTeamStyle, yourTeam, currentTeam, role}) => (
  <div style={R.merge(teamsStyle, infoBabyStyle)}>
    <div style={R.merge(teamsRowStyle, currentTeamStyle)}>
      <div>Current Team</div>
      <div style={largeTextStyle}>{currentTeam}</div>
    </div>
    <div style={R.merge(teamsRowStyle, yourTeamStyle)}>
      <div>Your Team</div>
      <div style={largeTextStyle}>{yourTeam}</div>
      { role !== SPYMASTER && <Pass />}
    </div>
  </div>
))

export default Teams
