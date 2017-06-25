import React from 'react'

import Card from './card.jsx'
import style from './card-row.css'

const CardRow = ({cards}) => (
  <div className={style.cardRow}>
    { cards.map((card) => (<Card key={card.id} {...card}/>)) }
  </div>
)

export default CardRow
