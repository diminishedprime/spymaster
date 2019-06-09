import React from 'react'
import * as t from '../../types'
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

interface StateProps {
  text: string;
  style: React.CSSProperties,
  disabled: boolean,
  currentTeam: t.Team,
  playerTeam: t.Team,
  role: t.Role,
}

interface DispatchProps {
  flip: () => void;
}

interface CardProps {
  cardId: t.CardId;
}

type AllProps = StateProps & DispatchProps & CardProps;

const cardStyle: React.CSSProperties = ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '5px',
  minWidth: '10.5em',
})


const mapStateToProps = (state: t.ReduxState, {cardId}: CardProps): StateProps => {
  const cardTeam: t.Team = R.view(cardTeamByCardId(cardId), state)
  const text: string = R.view(cardTextByCardId(cardId), state)
  const flipped: boolean = R.view(cardFlippedByCardId(cardId), state)
  const role: t.Role = R.view(rolePath, state)
  const styleForTeam: React.CSSProperties = R.view(styleForTeamPath(cardTeam), state)
  const playerTeam: t.Team = R.view(teamPath, state)
  const currentTeam: t.Team = R.view(currentTeamPath, state)
  const hintSubmitted: boolean = R.view(hintSubmittedPath, state)
  const baseStyle: React.CSSProperties = {
    color: '#000000',
    backgroundColor: '#ffffff',
  }
  const style: React.CSSProperties = (flipped || role === 'spymaster')
                                   ? R.compose(
                                     R.assoc('opacity', flipped ? 0.2 : 1.0)
                                   )(styleForTeam)
                                   : baseStyle
  const disabled: boolean = (role === 'spymaster') ||
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

const mapDispatchToProps = (dispatch: t.Dispatch, {cardId}: CardProps): DispatchProps => ({
  flip: () => dispatch(afFlipCard(cardId)),
})

const Card: React.FC<AllProps> = ({text, style, flip, disabled}) => (
  <button disabled={disabled}
          style={R.merge(cardStyle, style)}
          onClick={flip}>
    {text}
  </button>
)

export default connect<StateProps, DispatchProps, CardProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Card)
