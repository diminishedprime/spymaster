import React from 'react'

import Hint from '../hint/hint.jsx'

import Teams from './teams.jsx'
import User from './user.jsx'

const infoStyle = ({
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
})

const Info = () => (
  <div style={infoStyle}>
    <Hint />
    <Teams />
    <User />
  </div>
)

export default Info
