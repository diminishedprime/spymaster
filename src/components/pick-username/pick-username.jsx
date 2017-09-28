import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import {
  afSetEditing,
  afSetUsername,
  afSetServerUsername,
} from '../../redux/actions.js'
import {
  usernamePath,
  editingPath,
} from '../../redux/paths.js'

const pickUsernameStyle = ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const usernameInputStyle = ({
  minWidth: '200px',
  textAlign: 'center',
})

const editUsernameStyle = ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const usernameButtonStyle = ({
  width: '5em',
})

const mapStateToProps = (state) => ({
  username: R.view(usernamePath, state),
  editing: R.view(editingPath, state),
})

const mapDispatchToProps = (dispatch) => {
  const setEditing = () => dispatch(afSetEditing())
  const changeUsername = (username) => dispatch(afSetUsername(username))
  const updateUsername = () => dispatch(afSetServerUsername())

  const onKeyPress = ({key}) => (key === 'Enter') ? updateUsername() : null
  const onChange = ({target: {value}}) => changeUsername(value)
  const onFocus = (event) => event.target.select()

  return ({
    setEditing,
    changeUsername,
    onChange,
    updateUsername,
    onKeyPress,
    onFocus,
  })
}

const EditUsername = connect(
  mapStateToProps,
  mapDispatchToProps
)(({username, onChange, onKeyPress, updateUsername, onFocus}) => (
  <div style={editUsernameStyle}>
    <input style={usernameInputStyle}
           value={username}
           onChange={onChange}
           onKeyPress={onKeyPress}
           onFocus={onFocus}
    />
    <button style={usernameButtonStyle} onClick={updateUsername}>update</button>
  </div>
))

const ShowUsername = connect(
  mapStateToProps,
  mapDispatchToProps
)(({setEditing, username}) => (
  <div onClick={setEditing}>
    {username}
  </div>
))

const Username = connect(
  mapStateToProps
)(({editing}) => (
  <div>
    { editing ? <EditUsername /> : <ShowUsername /> }
  </div>
))

const PickUsername = () => (
  <div style={pickUsernameStyle}>
    <div>Your Name</div>
    <Username />
  </div>
)

export default PickUsername
