import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import PickUsername from '../pick-username/pick-username.jsx'
import ConnectedUsers from '../connected-users/connected-users.jsx'
import {
  afNewGame2,
  afJoinGame,
} from '../../redux/actions.js'
import {
  gameIdsPath,
} from '../../redux/paths.js'

const mapStateToProps = (state) => ({
  gameIds: R.view(gameIdsPath, state),
})

const mapDispatchToProps = (dispatch) => ({
  newGame: () => dispatch(afNewGame2()),
})

const JoinGame = connect(
  () => ({}),
  (dispatch, {gameId}) => ({
    joinGame: () => dispatch(afJoinGame(gameId)),
  })
)(({gameId, joinGame}) => (
  <button onClick={joinGame}>{gameId.substring(0, 8)}</button>
))

const Lobby = ({newGame, gameIds}) => (
  <div>
    <button onClick={newGame}>New Game</button>
    <div>
      Join Existing Game
      <div>
        {R.map((gameId) => (
           <JoinGame key={gameId} gameId={gameId} />
         ),gameIds)

        }
      </div>
    </div>
    <PickUsername />
    <ConnectedUsers />
  </div>
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lobby)
