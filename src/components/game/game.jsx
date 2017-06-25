import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import {
  afStartTimer,
  afForfeit,
} from '../../redux/actions.js'
import {
  afEmitAction,
} from '../../sagas/connect-to-websocket.js'
import Card from '../card/card.jsx'
import Hint from '../hint/hint.jsx'
import {
  fgColorForRGB,
  hexToRGB,
} from '../../util.js'
import {
  timePath,
  rolePath,
  teamPath,
  cardsPath,
  backgroundColorPath,
  currentTeamPath,
  usernamePath,
} from '../../redux/paths.js'

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
    time: R.view(timePath, state),
  }),
  (dispatch) => ({start: () => dispatch(afEmitAction(afStartTimer()))})
)(({time, start}) => (
  <div className="timer">
    { time ?
      <div>Time Remaining: {time} </div> :
      <button onClick={start}>Start Timer</button>}
  </div>
))

const Forfeit = connect(
  (state) => ({team: R.view(teamPath, state)}),
  (dispatch) => ({
    forfeit: (team) => () => dispatch(afEmitAction(afForfeit(team))),
  })
)(({team, forfeit}) => (
  <button onClick={forfeit(team)}>Forfeit</button>
))

const Teams = connect(
  (state) => {
    const currentTeam = R.view(currentTeamPath, state)
    const yourTeam = R.view(teamPath, state)
    const currentBackgroundColor = R.view(backgroundColorPath(currentTeam), state)
    const yourBackgroundColor = R.view(backgroundColorPath(yourTeam), state)
    const currentColor = fgColorForRGB(hexToRGB(currentBackgroundColor))
    const yourColor = fgColorForRGB(hexToRGB(yourBackgroundColor))
    const yourTeamStyle = {
      color: yourColor,
      backgroundColor: yourBackgroundColor,
    }
    const currentTeamStyle = {
      color: currentColor,
      backgroundColor: currentBackgroundColor,
    }
    return ({
      yourTeam,
      currentTeam,
      currentTeamStyle,
      yourTeamStyle,
    })
  }
)(({currentTeamStyle, yourTeamStyle, yourTeam, currentTeam}) => (
  <div className="teams">
    <div className="teamsRow" style={currentTeamStyle}>
      <div>Current Team</div>
      <div className="teamsValue">{currentTeam}</div>
    </div>
    <div className="teamsRow" style={yourTeamStyle}>
      <div>Your Team</div>
      <div className="teamsValue">{yourTeam}</div>
      <Forfeit />
    </div>
  </div>
))

const User = connect(
  (state) => {
    const role = R.view(rolePath, state)
    const team = R.view(teamPath, state)
    const backgroundColor = R.view(backgroundColorPath(team), state)
    const color = fgColorForRGB(hexToRGB(backgroundColor))
    const style = {
      color,
      backgroundColor,
    }
    return ({
      style,
      role: role,
      username: R.view(usernamePath, state),
    })
  }
)(({role, username, style}) => (
  <div className="user" style={style}>
    <div className="userRow">
      <div>Role</div>
      <div className="userRowValue">{role}</div>
    </div>
    <div className="userRow">
      <div>Username</div>
      <div className="userRowValue">{username}</div>
    </div>
  </div>
))

const Info = () => (
  <div className="info">
    <Hint />
    <Teams />
    <User />
  </div>
)

const Game = connect(
  (state) => ({
    cards: R.view(cardsPath, state),
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
