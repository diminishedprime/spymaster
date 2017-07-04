import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import {
  rolePath,
  teamPath,
  styleForTeamPath,
  usernamePath,
} from '../../redux/paths.js'
import font from '../font.css'

import Score from './score.jsx'
import s from './user.css'
import i from './info.css'

const User = connect(
  (state) => {
    const role = R.view(rolePath, state)
    const team = R.view(teamPath, state)
    const style = R.view(styleForTeamPath(team), state)
    return ({
      style,
      role: role,
      username: R.view(usernamePath, state),
    })
  }
)(({role, username, style}) => (
  <div className={s.thing + ' ' + i.infoBaby}>
    <div className={s.user} style={style}>
      <div className={s.userRow}>
        <div>Role</div>
        <div className={font.largeText}>{role}</div>
      </div>
      <div className={s.userRow}>
        <div>Username</div>
        <div className={font.largeText}>{username}</div>
      </div>
    </div>
    <Score />
  </div>
))

export default User
