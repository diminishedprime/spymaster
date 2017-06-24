import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { afStartTimer } from '../../sagas/timer.js'
import Card from '../card/card.jsx'
import './game.css'

const CardRow = ({cards}) => (
  <div className="cardRow">
    {
      cards
        .map((card) => (
          <Card key={card.id} {...card}/>
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


const Info = connect(
  ({localState: {playerType: {role, team}}}) => ({
    role,
    team,
  })
)(({role, team}) => (
  <div>
    {role} {team}
  </div>
))

const Game = ({cards}) => (
  <div className="game">
    <Timer />
    <Board cards={cards} />
    <Timer />
    <Info />
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
