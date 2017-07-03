import React from 'react'
import {
  connect,
} from 'react-redux'

import PickUsername from '../pick-username/pick-username.jsx'
import ConnectedUsers from '../connected-users/connected-users.jsx'

const mapStateToProps = (_) => ({
})

const mapDispatchToProps = (_) => ({
})

const Lobby = () => (
  <div>
    <PickUsername />
    <ConnectedUsers />
  </div>
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lobby)
