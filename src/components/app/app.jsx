import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import ErrorBar from '../error-bar/error-bar.jsx'
import Game from '../game/game.jsx'
import PickTeam from '../pick-team/pick-team.jsx'
import PickUsername from '../pick-username/pick-username.jsx'
import {
  afToggleTitle,
} from '../../redux/actions.js'
import {
  errorTextPath,
  showTitlePath,
  gameModePath,
  userListPath,
} from '../../redux/paths.js'
import './app.css'

const ConnectedUsers = connect(
  (state) => ({
    users: R.view(userListPath, state),
  })
)(({users}) => (
  <div className="connectedUsers">
    <h3>Connected Users</h3>
    <div className="users">
      {users
        .map((user) => (
          <div key={user}>{user}</div>
        ))}
    </div>
  </div>
))

const App = ({hasError, showTitle, toggleTitle, gameMode}) => (
  <div className="app">
    {hasError && <ErrorBar />}
    {showTitle && <div className="title" onClick={toggleTitle}>Spymaster</div>}
    {gameMode === 'game' && <Game />}
    {gameMode === 'pick team' && <PickUsername />}
    {gameMode === 'pick team' && <PickTeam />}
    <ConnectedUsers />

  </div>
)
const mapStateToProps = (state) => ({
  hasError: R.view(errorTextPath, state),
  showTitle: R.view(showTitlePath, state),
  gameMode: R.view(gameModePath, state),
})

const mapDispatchToProps = (dispatch) => ({
  toggleTitle: () => dispatch(afToggleTitle()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
