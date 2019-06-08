import React from 'react'
import {
  connect,
} from 'react-redux'

import {
  afNewGame,
} from '../../redux/actions'

const mapDispatchToProps = (dispatch) => ({
  onClick: () => dispatch(afNewGame()),
})

const NewGame = ({onClick}) => (
  <button onClick={onClick}>New Game</button>
)

export default connect(
  undefined,
  mapDispatchToProps
)(NewGame)
