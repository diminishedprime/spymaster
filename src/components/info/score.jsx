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
    const cards = R.view(cardsPath, state)

    const team1BackgroundColor = R.view(backgroundColorPath(TEAM_1), state)
    const team1ForegroundColor = fgColorForRGB(hexToRGB(team1BackgroundColor))

    const team1cards = R.filter(({team}) => team===TEAM_1, cards)
    const team1Total = R.keys(team1cards).length
    const team1Flipped = R.keys(R.filter(R.prop('flipped'), team1cards)).length

    const team1Style = {
      color: team1ForegroundColor,
      backgroundColor: team1BackgroundColor,
    }

    const team2BackgroundColor = R.view(backgroundColorPath(TEAM_2), state)
    const team2ForegroundColor = fgColorForRGB(hexToRGB(team2BackgroundColor))

    const team2cards = R.filter(({team}) => team===TEAM_2, cards)
    const team2Total = R.keys(team2cards).length
    const team2Flipped = R.keys(R.filter(R.prop('flipped'), team2cards)).length

    const team2Style = {
      color: team2ForegroundColor,
      backgroundColor: team2BackgroundColor,
    }

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
