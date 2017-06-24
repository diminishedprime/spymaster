import React from 'react'
import { connect } from 'react-redux'
import ErrorBar from '../error-bar/error-bar.jsx'
import Game from '../game/game.jsx'
import { CirclePicker } from 'react-color'
import { afChangeColor, afPickRole, afToggleTitle, afSetEditing, afSetUsername } from '../../redux/actions.js'
import { fgColorForRGB, hexToRGB } from '../../util.js'
import { afEmitAction, afSetServerUsername } from '../../sagas/connect-to-websocket.js'
import paths from '../../redux/paths.js'
import R from 'ramda'
import './app.css'

/*
 * import {store} from '../../redux.js'
 * setTimeout(() => {
 *   store.dispatch(afPickRole('1', 'spymaster'))
 * }, 300)*/

const StyledButton = ({backgroundColor, text, onClick}) => (
  <button onClick={onClick}
    style={{
      backgroundColor,
      color: fgColorForRGB(hexToRGB(backgroundColor)),
    }} >
    {text}
  </button>
)

const TeamRow = connect(
  (state, {team}) => ({
    backgroundColor: R.view(paths.backgroundColorPath(team), state),
  }),
  (dispatch, {team}) => ({
    onColorChange: ({hex}) => dispatch(afEmitAction(afChangeColor(team, hex))),
    pickRole: (role) => () => dispatch(afPickRole(team, role)),
  })
)(({onColorChange, backgroundColor, pickRole}) => (
  <div className="teamRow">
    <div className="teamButtons">
      <StyledButton text="Spymaster"
        backgroundColor={backgroundColor}
        onClick={pickRole('spymaster')}
      />
      <StyledButton text="Agent"
        backgroundColor={backgroundColor}
        onClick={pickRole('agent')}
      />
    </div>
    <CirclePicker onChangeComplete={onColorChange}
      color={backgroundColor}/>
  </div>
))

const Username = connect(
  (state) => ({
    username: R.view(paths.usernamePath, state),
    editing: R.view(paths.editingPath, state),
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

const PickTeam = () => (
  <div className="pickTeam" >
    <TeamRow team="1" />
    <TeamRow team="2" />
  </div>
)

const ConnectedUsers = connect(
  (state) => ({
    users: R.view(paths.userListPath, state),
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
  hasError: R.view(paths.errorTextPath, state),
  showTitle: R.view(paths.showTitlePath, state),
  gameMode: R.view(paths.gameModePath, state),
})

const mapDispatchToProps = (dispatch) => ({
  toggleTitle: () => dispatch(afToggleTitle()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
