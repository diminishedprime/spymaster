import React from 'react'
import * as t from '../../types';

import Card from './card'

const rowStyle: React.CSSProperties = ({
  display: 'flex',
  flexWrap: 'wrap',
})

interface CardRowProps {
  cardIds: t.CardId[];
}

const CardRow: React.FC<CardRowProps> = ({cardIds}) => (
  <div style={rowStyle}>
    { cardIds.map((cardId: string) => (<Card cardId={cardId} />)) }
  </div>
)

export default CardRow
