import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import Lobby from '../lobby/lobby.jsx'
import ErrorBar from '../error-bar/error-bar.jsx'
import Game from '../game/game.jsx'
import PickTeam from '../pick-team/pick-team.jsx'
import PickUsername from '../pick-username/pick-username.jsx'
import Win from '../win/win.jsx'
import {
  afToggleTitle,
} from '../../redux/actions.js'
import {
  errorTextPath,
  showTitlePath,
  page,
  winnerPath,
} from '../../redux/paths.js'
import {
  LOBBY,
  GAME_MODE_GAME,
  GAME_MODE_PICK_TEAM,
} from '../../constants.js'

const appStyle = ({
  fontFamily: 'Helvetica',
  margin: 'auto',
  border: '3px solid #f6f8fa',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const titleStyle = ({
  paddingTop: '5px',
  paddingBottom: '5px',
  textAlign: 'center',
  fontSize: '2.5em',
  backgroundColor: '#f6f8fa',
})

const mapStateToProps = (state) => ({
  winner: R.view(winnerPath, state),
  hasError: R.view(errorTextPath, state),
  showTitle: R.view(showTitlePath, state),
  page: R.view(page, state),
})

const mapDispatchToProps = (dispatch) => ({
  toggleTitle: () => dispatch(afToggleTitle()),
})

const App = ({hasError, showTitle, toggleTitle, page, winner}) => (
  <div style={appStyle}>
    {hasError && <ErrorBar />}
    {!winner && (
       <div>
         {showTitle && <div style={titleStyle} onClick={toggleTitle}>Spymaster</div>}
         {page === LOBBY && <Lobby />}
         {page === GAME_MODE_GAME && <Game />}
         {page === GAME_MODE_PICK_TEAM && <PickUsername />}
         {page === GAME_MODE_PICK_TEAM && <PickTeam />}
       </div>)
    }
    { winner && <Win />}
  </div>
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
