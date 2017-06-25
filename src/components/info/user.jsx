import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import {
  fgColorForRGB,
  hexToRGB,
} from '../../util.js'
import {
  rolePath,
  teamPath,
  backgroundColorPath,
  usernamePath,
} from '../../redux/paths.js'
import font from '../font.css'

import s from './user.css'

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
))

export default User
