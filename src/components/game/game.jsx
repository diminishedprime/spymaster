import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { afUpdateHint } from '../../redux/actions.js'
import { afStartTimer } from '../../sagas/timer.js'
import Card from '../card/card.jsx'
import { fgColorForRGB, hexToRGB } from '../../util.js'
import paths from '../../redux/paths.js'
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
  (state) => ({
    time: R.view(paths.timePath, state),
  }),
  (dispatch) => ({start: () => dispatch(afStartTimer())})
)(({time, start}) => (
  <div className="timer">
    { time ?
      <div>Time Remaining: {time} </div> :
      <button onClick={start}>Start Timer</button>}
  </div>
))


const InfoColumn = connect(
  (state, {backgroundColor}) => {
    const team = R.view(paths.teamPath, state),
          bgColor = backgroundColor ||
                    R.view(paths.backgroundColorPath(team), state),
          fgColor = fgColorForRGB(hexToRGB(bgColor))
    return {
      style: {
        color: fgColor,
        backgroundColor: bgColor,
      },
    }
  }
)(({label, value, style}) => (
  <div className="infoColumn" style={style}>
    <div>{label}</div>
    <div className="infoColumnValue">{value}</div>
  </div>
))

const Hint = connect(
  (state) => ({
    text: R.view(paths.hintTextPath, state),
    number: R.view(paths.hintNumberPath, state),
    role: R.view(paths.rolePath, state),
  }),
  (dispatch) => ({
    updateHint: (hint) => dispatch(afUpdateHint(hint)),
  })
)(({text, number, role, updateHint}) => (
  <div>
    {
      (role === 'agent')
        ? (
          <div className="infoColumn">
            <div>Hint</div>
            <div className="infoColumnValue">{text}</div>
            <div className="infoColumnValue">{number}</div>
          </div>
        )
        : (
          <div className="infoColumn">
            <input value={text}
              onChange={({target: {value}}) => updateHint(value)}/>
            <div className="numbers">
              {['0', '1', '2', '3'].map(
                (number) => (
                  <button key={number}>{number}</button>
                )
              )
              }
            </div>
          </div>
        )
    }

  </div>
))

const Info = connect(
  (state) => {
    const currentTeam = R.view(paths.currentTeamPath, state)
    return ({
      role: R.view(paths.rolePath, state),
      team: R.view(paths.teamPath, state),
      currentTeam,
      backgroundColor: R.view(paths.backgroundColorPath(currentTeam), state),
      username: R.view(paths.usernamePath, state),
    })
  }
)(({role, team, currentTeam, backgroundColor, username}) => (
  <div className="info">
    <InfoColumn label="Current Team"
      value={currentTeam}
      backgroundColor={backgroundColor}
    />
    <Hint />
    <InfoColumn label="Your Role" value={role} />
    <InfoColumn label="Username" value={username} />
    <InfoColumn label="Your Team" value={team} />
  </div>
))

const Game = connect(
  (state) => ({
    cards: R.view(paths.cardsPath, state),
  })
)(({cards}) => (
  <div className="game">
    <Timer />
    <Board cards={cards} />
    <Timer />
    <Info />
  </div>

))

export default Game
