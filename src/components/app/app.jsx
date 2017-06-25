import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import ErrorBar from '../error-bar/error-bar.jsx'
import Game from '../game/game.jsx'
import PickTeam from '../pick-team/pick-team.jsx'
import {
  afToggleTitle,
  afSetEditing,
  afSetUsername,
} from '../../redux/actions.js'
import {
  afSetServerUsername,
} from '../../sagas/connect-to-websocket.js'
import {
  errorTextPath,
  showTitlePath,
  gameModePath,
  usernamePath,
  editingPath,
  userListPath,
} from '../../redux/paths.js'
import './app.css'

/*
 * import {store} from '../../redux.js'
 * setTimeout(() => {
 *   store.dispatch(afPickRole('1', 'spymaster'))
 * }, 300)*/

const Username = connect(
  (state) => ({
    username: R.view(usernamePath, state),
    editing: R.view(editingPath, state),
  }),
  (dispatch) => ({
    setEditing: () => dispatch(afSetEditing()),
    changeUsername: (username) => dispatch(afSetUsername(username)),
    updateUsername: () => dispatch(afSetServerUsername()),
  })
)(({editing, username, setEditing, changeUsername, updateUsername}) => (
  <div>
    {editing
      ? (
        <div>
          <input className="usernameInput"
            value={username}
            onChange={({target: {value}}) => changeUsername(value)}
          />
          <button onClick={updateUsername}>submit</button>
        </div>
      )
      : (
        <div onClick={setEditing}>
          {username}
        </div>
      )

    }
  </div>
))

const PickUsername = () => (
  <div className="pickUsername">
    <div>Your Name</div>
    <Username />
  </div>
)

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
