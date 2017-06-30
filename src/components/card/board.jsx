import React from 'react'
import R from 'ramda'

import CardRow from './card-row.jsx'
import style from './board.css'

const Board = ({cardIds}) => (
  <div className={style.board}>
    { R
      .splitEvery(5, cardIds)
      .map((cardIds) => (
        <CardRow key={cardIds} cardIds={cardIds} />
      ))
    }
  </div>
)

export default Board
