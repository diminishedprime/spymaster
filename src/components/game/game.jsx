import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { afStartTimer } from '../../sagas/timer.js'
import './game.css'

const Card = ({text}) => (<button className="card" > {text} </button>)

const CardRow = ({cards}) => (
  <div className="cardRow">
    {
      cards
        .map((card, idx) => (
          <Card key={idx} {...card} />
        ))
    }
  </div>
)

const Board = ({cards}) => (
  <div className="board">
    {
      R
        .splitEvery(5, cards)
        .map((cards, idx) => (
          <CardRow key={idx} cards={cards} />
        ))
    }
  </div>
)

const Timer = connect(
  ({time}) => ({time}),
  (dispatch) => ({start: () => dispatch(afStartTimer())})
)(({time, start}) => (
  <div className="timer">
    { time ?
      <div>Time Remaining: {time} </div> :
      <button onClick={start}>Start Timer</button>}
  </div>
))



const Game = ({cards}) => (
  <div className="game">
    <Timer />
    <Board cards={cards} />
    <Timer />
  </div>

)
const mapStateToProps = ({cards}) => ({
  cards,
})

const mapDispatchToProps = () => ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game)
