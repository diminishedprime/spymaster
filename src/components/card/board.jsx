import React from 'react'
import R from 'ramda'

import CardRow from './card-row.jsx'

const Board = ({cards}) => (
  <div className="board">
    { R
      .splitEvery(5, cards)
      .map((cards, idx) => (
        <CardRow key={idx} cards={cards} />
      ))
    }
  </div>
)

export default Board
