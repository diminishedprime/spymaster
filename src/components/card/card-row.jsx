import React from 'react'

import Card from './card.jsx'

const rowStyle = ({
  display: 'flex',
  flexWrap: 'wrap',
})

const CardRow = ({cardIds}) => (
  <div style={rowStyle}>
    { cardIds.map((cardId) => (<Card key={cardId} cardId={cardId} />)) }
  </div>
)

export default CardRow
