import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import PickUsername from '../pick-username/pick-username.jsx'
import ConnectedUsers from '../connected-users/connected-users.jsx'
import {
  afNewGame2,
} from '../../redux/actions.js'
import {
  userIdPath,
} from '../../redux/paths.js'

const mapStateToProps = (state) => ({
  userId: R.view(userIdPath, state),
})

const mapDispatchToProps = (dispatch) => ({
  newGame: () => dispatch(afNewGame2()),
})

const Lobby = ({newGame, userId}) => (
  <div>
    {userId}
    <button onClick={newGame}>New Game</button>
    <PickUsername />
    <ConnectedUsers />
  </div>
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lobby)
