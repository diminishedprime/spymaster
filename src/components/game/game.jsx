import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import {
  afStartTimer,
  afForfeit,
} from '../../redux/actions.js'
import { afEmitAction } from '../../sagas/connect-to-websocket.js'
import Card from '../card/card.jsx'
import Hint from '../hint/hint.jsx'
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
  (dispatch) => ({start: () => dispatch(afEmitAction(afStartTimer()))})
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

const YourTeam = connect(
  (state) => {
    const team = R.view(paths.teamPath, state),
          bgColor = R.view(paths.backgroundColorPath(team), state),
          fgColor = fgColorForRGB(hexToRGB(bgColor)),
          style = {
            color: fgColor,
            backgroundColor: bgColor,
          }
    return ({
      team,
      style,
    })
  },
  (dispatch) => ({
    forfeit: (team) => () => dispatch(afEmitAction(afForfeit(team))),
  })
)(({team, style, forfeit}) => (
  <div className="infoColumn" style={style}>
    <div>Your Team</div>
    <div className="infoColumnValue">{team}</div>
    <button onClick={forfeit(team)}>Forfeit</button>
  </div>
))

const Info = connect(
  (state) => {
    const currentTeam = R.view(paths.currentTeamPath, state)
    return ({
      role: R.view(paths.rolePath, state),
      currentTeam,
      backgroundColor: R.view(paths.backgroundColorPath(currentTeam), state),
      username: R.view(paths.usernamePath, state),
    })
  }
)(({role, currentTeam, backgroundColor, username}) => (
  <div className="info">
    <InfoColumn label="Current Team"
      value={currentTeam}
      backgroundColor={backgroundColor}
    />
    <Hint />
    <YourTeam />
    <InfoColumn label="Your Role" value={role} />
    <InfoColumn label="Username" value={username} />
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
