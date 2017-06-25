import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import {
  afSetEditing,
  afSetUsername,
} from '../../redux/actions.js'
import {
  afSetServerUsername,
} from '../../sagas/connect-to-websocket.js'
import {
  usernamePath,
  editingPath,
} from '../../redux/paths.js'
import './pick-username.css'

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

export default PickUsername
