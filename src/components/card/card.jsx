import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { afFlipCard } from '../../redux.js'
import { fgColorForRGB, hexToRGB } from '../../util.js'
import './card.css'

const mapStateToProps = ({
  colors,
  localState: {playerType: {role, team: playerTeam}},
  currentTeam,
}, {
  team: cardTeam,
  flipped,
}) => {
  const bgColor = colors[cardTeam].backgroundColor,
        baseStyle = {
          color: '#000000',
          backgroundColor: '#ffffff',
        },
        style = (flipped || role === 'spymaster')
          ? R.compose(
            R.assoc('color', fgColorForRGB(hexToRGB(bgColor))),
            R.assoc('backgroundColor', bgColor)
          )(baseStyle)
          : baseStyle
  return {
    style,
    playerTeam,
    role,
    currentTeam,
  }
}

const mapDispatchToProps = (dispatch, {id}) => ({
  flip: (playerTeam, role, currentTeam) => () => {
    if ( role !== 'spymaster' && playerTeam === currentTeam )
      dispatch(afFlipCard(id))
  },
})

const Card = ({text, style, flip, playerTeam, role, currentTeam}) => (
  <button className="card"
    style={style}
    onClick={flip(playerTeam, role, currentTeam)}>
    {text}
  </button>
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Card)
