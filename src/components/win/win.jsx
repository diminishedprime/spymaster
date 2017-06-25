import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import {
  winnerPath,
} from '../../redux/paths.js'

const mapStateToProps = (state) => ({
  winner: R.view(winnerPath, state),
})

const Win = ({winner}) => (
  <div>The winner was {winner}</div>
)

export default connect(
  mapStateToProps
)(Win)
