import React from 'react'

import Card from './card.jsx'
import './card-row.css'

const CardRow = ({cards}) => (
  <div className="cardRow">
    { cards.map((card) => (<Card key={card.id} {...card}/>)) }
  </div>
)

export default CardRow
