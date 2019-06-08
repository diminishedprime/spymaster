import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import {
  afFlipCard,
} from '../../redux/actions'
import {
  hintSubmittedPath,
  rolePath,
  teamPath,
  styleForTeamPath,
  currentTeamPath,
  cardFlippedByCardId,
  cardTeamByCardId,
  cardTextByCardId,
} from '../../redux/paths'

const cardStyle = ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '5px',
  minWidth: '10.5em',
})

const mapStateToProps = (state, {cardId}) => {
  const cardTeam = R.view(cardTeamByCardId(cardId), state)
  const text = R.view(cardTextByCardId(cardId), state)
  const flipped = R.view(cardFlippedByCardId(cardId), state)
  const role = R.view(rolePath, state)
  const styleForTeam = R.view(styleForTeamPath(cardTeam), state)
  const playerTeam = R.view(teamPath, state)
  const currentTeam = R.view(currentTeamPath, state)
  const hintSubmitted = R.view(hintSubmittedPath, state)
  const baseStyle = {
    color: '#000000',
    backgroundColor: '#ffffff',
  }
  const style = (flipped || role === 'spymaster')
              ? R.compose(
                R.assoc('opacity', flipped ? 0.2 : 1.0)
              )(styleForTeam)
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
  <button disabled={disabled}
                    style={R.merge(cardStyle, style)}
                    onClick={flip}>
    {text}
  </button>
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Card)
