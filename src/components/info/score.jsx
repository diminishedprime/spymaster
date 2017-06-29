import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import {
  TEAM_1,
  TEAM_2,
} from '../../constants.js'
import {
  fgColorForRGB,
  hexToRGB,
} from '../../util.js'
import {
  backgroundColorPath,
  cardsPath,
} from '../../redux/paths.js'

import s from './score.css'


const Teams = connect(
  (state) => {
    const currentTeam = TEAM_1
    const yourTeam = TEAM_2
    const currentBackgroundColor = R.view(backgroundColorPath(currentTeam), state)
    const yourBackgroundColor = R.view(backgroundColorPath(yourTeam), state)
    const currentColor = fgColorForRGB(hexToRGB(currentBackgroundColor))
    const yourColor = fgColorForRGB(hexToRGB(yourBackgroundColor))
    const team1Style = {
      color: yourColor,
      backgroundColor: yourBackgroundColor,
    }
    const team2Style = {
      color: currentColor,
      backgroundColor: currentBackgroundColor,
    }
    const cards = R.view(cardsPath, state)
    const team1 = R.filter(({team}) => team===TEAM_1, cards)
    const team1Total = team1.length
    const team1Flipped = R.filter(R.prop('flipped'), team1).length
    const team2 = R.filter(({team}) => team===TEAM_2, cards)
    const team2Total = team2.length
    const team2Flipped = R.filter(R.prop('flipped'), team2).length
    return ({
      team1Flipped,
      team1Total,
      team2Flipped,
      team2Total,

      team1Style,
      team2Style,
    })
  }
)(({team1Flipped, team1Total, team2Flipped, team2Total, team1Style, team2Style}) => (
  <div className={s.score}>
    <div className={s.team} style={team1Style}>
      {team1Flipped} / {team1Total}
    </div>
    <div className={s.team} style={team2Style}>
      {team2Flipped} / {team2Total}
    </div>
  </div>
))

export default Teams
