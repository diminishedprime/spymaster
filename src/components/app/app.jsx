import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import ErrorBar from '../error-bar/error-bar.jsx'
import Game from '../game/game.jsx'
import PickTeam from '../pick-team/pick-team.jsx'
import PickUsername from '../pick-username/pick-username.jsx'
import ConnectedUsers from '../connected-users/connected-users.jsx'
import Win from '../win/win.jsx'
import {
  afToggleTitle,
} from '../../redux/actions.js'
import {
  errorTextPath,
  showTitlePath,
  gameModePath,
  winnerPath,
} from '../../redux/paths.js'
import {
  GAME_MODE_GAME,
  GAME_MODE_PICK_TEAM,
} from '../../constants.js'

import style from './app.css'

const mapStateToProps = (state) => ({
  winner: R.view(winnerPath, state),
  hasError: R.view(errorTextPath, state),
  showTitle: R.view(showTitlePath, state),
  gameMode: R.view(gameModePath, state),
})

const mapDispatchToProps = (dispatch) => ({
  toggleTitle: () => dispatch(afToggleTitle()),
})

const App = ({hasError, showTitle, toggleTitle, gameMode, winner}) => (
  <div className={style.app}>
    {hasError && <ErrorBar />}
    {!winner && (
       <div>
         {showTitle && <div className={style.title} onClick={toggleTitle}>Spymaster</div>}
         {gameMode === GAME_MODE_GAME && <Game />}
         {gameMode === GAME_MODE_PICK_TEAM && <PickUsername />}
         {gameMode === GAME_MODE_PICK_TEAM && <PickTeam />}
       </div>)
    }
    { winner && <Win />}
    <ConnectedUsers />
  </div>
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
