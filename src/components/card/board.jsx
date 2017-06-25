import React from 'react'
import R from 'ramda'

import CardRow from './card-row.jsx'
import style from './board.css'

const Board = ({cards}) => (
  <div className={style.board}>
    { R
      .splitEvery(5, cards)
      .map((cards, idx) => (
        <CardRow key={idx} cards={cards} />
      ))
    }
  </div>
)

export default Board
