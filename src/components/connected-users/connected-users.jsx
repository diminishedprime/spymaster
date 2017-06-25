import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import {
  userListPath,
} from '../../redux/paths.js'

import './connected-users.css'

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

export default ConnectedUsers
