import React from 'react'
import {
  connect,
} from 'react-redux'

import {
  afNewGame,
} from '../../redux/actions.js'
import {
  afEmitAction,
} from '../../sagas/connect-to-websocket.js'

const mapDispatchToProps = (dispatch) => ({
  onClick: () => dispatch(afEmitAction(afNewGame())),
})

const NewGame = ({onClick}) => (
  <button onClick={onClick}>New Game</button>
)

export default connect(
  undefined,
  mapDispatchToProps
)(NewGame)
