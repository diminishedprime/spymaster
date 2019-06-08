import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import {
  clientUsersPath,
} from '../../redux/paths'

const connectedUsersStyle = ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
})

const usersStyle = ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',

})

const ConnectedUsers = connect(
  (state) => ({
    users: R.keys(R.view(clientUsersPath, state)),
  })
)(({users}) => (
  <div style={connectedUsersStyle}>
    <h3>Connected Users</h3>
    <div style={usersStyle}>
      {users
        .map((userId) => (
          <div key={userId}>{userId}</div>
        ))}
    </div>
  </div>
))

export default ConnectedUsers
