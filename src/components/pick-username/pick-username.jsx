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
} from '../../redux/sagas/connect-to-websocket.js'
import {
  usernamePath,
  editingPath,
} from '../../redux/paths.js'

import s from './pick-username.css'

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
  <div className={s.editUsername}>
    <input className={s.usernameInput}
           value={username}
           onChange={onChange}
           onKeyPress={onKeyPress}
           onFocus={onFocus}
    />
    <button className={s.usernameButton} onClick={updateUsername}>update</button>
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
  <div className={s.pickUsername}>
    <div>Your Name</div>
    <Username />
  </div>
)

export default PickUsername
