import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import {
  SPYMASTER,
} from '../../constants.js'
import {
  fgColorForRGB,
  hexToRGB,
} from '../../util.js'
import {
  teamPath,
  backgroundColorPath,
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
    const currentBackgroundColor = R.view(backgroundColorPath(currentTeam), state)
    const yourBackgroundColor = R.view(backgroundColorPath(yourTeam), state)
    const currentColor = fgColorForRGB(hexToRGB(currentBackgroundColor))
    const yourColor = fgColorForRGB(hexToRGB(yourBackgroundColor))
    const yourTeamStyle = {
      color: yourColor,
      backgroundColor: yourBackgroundColor,
    }
    const currentTeamStyle = {
      color: currentColor,
      backgroundColor: currentBackgroundColor,
    }
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
