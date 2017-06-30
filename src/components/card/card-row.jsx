import React from 'react'

import Card from './card.jsx'
import style from './card-row.css'

const CardRow = ({cardIds}) => (
  <div className={style.cardRow}>
    { cardIds.map((cardId) => (<Card key={cardId} cardId={cardId} />)) }
  </div>
)

export default CardRow
