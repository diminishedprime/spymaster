import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import {
  clientUsersPath,
} from '../../redux/paths.js'

import s from './connected-users.css'

const ConnectedUsers = connect(
  (state) => ({
    users: R.keys(R.view(clientUsersPath, state)),
  })
)(({users}) => (
  <div className={s.connectedUsers}>
    <h3>Connected Users</h3>
    <div className={s.users}>
      {users
        .map((userId) => (
          <div key={userId}>{userId}</div>
        ))}
    </div>
  </div>
))

export default ConnectedUsers
