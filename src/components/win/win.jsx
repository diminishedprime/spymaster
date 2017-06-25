import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import {
  winnerPath,
} from '../../redux/paths.js'

import NewGame from './new-game.jsx'

const mapStateToProps = (state) => ({
  winner: R.view(winnerPath, state),
})

const Win = ({winner}) => (
  <div>
    <div>The winner was {winner}</div>
    <NewGame />
  </div>

)

export default connect(
  mapStateToProps
)(Win)
