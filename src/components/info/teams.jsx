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
import font from '../font.css'

import Pass from './pass.jsx'
import s from './teams.css'
import i from './info.css'

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
  <div className={s.teams + ' ' + i.infoBaby}>
    <div className={s.teamsRow} style={currentTeamStyle}>
      <div>Current Team</div>
      <div className={font.largeText}>{currentTeam}</div>
    </div>
    <div className={s.teamsRow} style={yourTeamStyle}>
      <div>Your Team</div>
      <div className={font.largeText}>{yourTeam}</div>
      { role !== SPYMASTER && <Pass />}
    </div>
  </div>
))

export default Teams
