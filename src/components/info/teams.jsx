import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import Forfeit from './forfeit.jsx'

import {
  fgColorForRGB,
  hexToRGB,
} from '../../util.js'
import {
  teamPath,
  backgroundColorPath,
  currentTeamPath,
} from '../../redux/paths.js'

import './teams.css'

const Teams = connect(
  (state) => {
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
    })
  }
)(({currentTeamStyle, yourTeamStyle, yourTeam, currentTeam}) => (
  <div className="teams">
    <div className="teamsRow" style={currentTeamStyle}>
      <div>Current Team</div>
      <div className="teamsValue">{currentTeam}</div>
    </div>
    <div className="teamsRow" style={yourTeamStyle}>
      <div>Your Team</div>
      <div className="teamsValue">{yourTeam}</div>
      <Forfeit />
    </div>
  </div>
))

export default Teams
