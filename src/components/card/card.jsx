import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { afFlipCard } from '../../redux/actions.js'
import { fgColorForRGB, hexToRGB } from '../../util.js'
import paths from '../../redux/paths.js'
import './card.css'

/* {
 *   colors,
 *   localState: {playerType: {role, team: playerTeam}},
 *   currentTeam,
 * }*/

const mapStateToProps = (state, {
  team: cardTeam,
  flipped,
}) => {
  const role = R.view(paths.rolePath, state)
  const bgColor = R.view(paths.backgroundColorPath(cardTeam), state)
  const playerTeam = R.view(paths.teamPath, state)
  const currentTeam = R.view(paths.currentTeamPath, state)
  const baseStyle = {
    color: '#000000',
    backgroundColor: '#ffffff',
  }
  const style = (flipped || role === 'spymaster')
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
