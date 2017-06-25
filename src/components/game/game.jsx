import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import Board from '../card/board.jsx'
import Info from '../info/info.jsx'
import Timer from '../timer/timer.jsx'
import {
  cardsPath,
} from '../../redux/paths.js'

import './game.css'

const mapStateToProps = (state) => ({
  cards: R.view(cardsPath, state),
})

const Game = ({cards}) => (
  <div>
    <Timer />
    <Board cards={cards} />
    <Timer />
    <Info />
  </div>
)

export default connect(
  mapStateToProps
)(Game)
