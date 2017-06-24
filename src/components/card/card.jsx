import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { afFlipCard } from '../../redux/actions.js'
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
    flipped,
  }
}

const mapDispatchToProps = (dispatch, {id}) => ({
  flip: () => dispatch(afFlipCard(id)),
})

const Card = ({
  text,
  style,
  flip,
  playerTeam,
  role,
  currentTeam,
  flipped,
}) => (
  <button className="card"
    disabled={role === 'spymaster' || playerTeam !== currentTeam || flipped}
    style={style}
    onClick={flip}>
    {text}
  </button>
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Card)
