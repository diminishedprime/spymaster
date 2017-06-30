import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import {
  afFlipCard,
} from '../../redux/actions.js'
import {
  fgColorForRGB,
  hexToRGB,
} from '../../util.js'
import {
  hintSubmittedPath,
  rolePath,
  teamPath,
  backgroundColorPath,
  currentTeamPath,
  cardFlippedByCardId,
  cardTeamByCardId,
  cardTextByCardId,
} from '../../redux/paths.js'

import cssStyle from './card.css'

const mapStateToProps = (state, {cardId}) => {
  const cardTeam = R.view(cardTeamByCardId(cardId), state)
  const text = R.view(cardTextByCardId(cardId), state)
  const flipped = R.view(cardFlippedByCardId(cardId), state)
  const role = R.view(rolePath, state)
  const bgColor = R.view(backgroundColorPath(cardTeam), state)
  const playerTeam = R.view(teamPath, state)
  const currentTeam = R.view(currentTeamPath, state)
  const hintSubmitted = R.view(hintSubmittedPath, state)
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
  const disabled = (role === 'spymaster') ||
                   (playerTeam !== currentTeam) ||
                   flipped ||
                   (!hintSubmitted)
  return {
    text,
    style,
    playerTeam,
    role,
    currentTeam,
    disabled,
  }
}

const mapDispatchToProps = (dispatch, {cardId}) => ({
  flip: () => dispatch(afFlipCard(cardId)),
})

const Card = ({
  text,
  style,
  flip,
  disabled,
}) => (
  <button className={cssStyle.card}
          disabled={disabled}
          style={style}
          onClick={flip}>
    {text}
  </button>
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Card)
