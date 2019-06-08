import React from 'react'
import R from 'ramda'

import CardRow from './card-row'

const boardStyle = ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
})

const Board = ({cardIds}) => (
  <div style={boardStyle}>
    { R
      .splitEvery(5, cardIds)
      .map((cardIds) => (
        <CardRow key={cardIds} cardIds={cardIds} />
      ))
    }
  </div>
)

export default Board
