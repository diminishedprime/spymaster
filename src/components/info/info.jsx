import React from 'react'

import Hint from '../hint/hint.jsx'

import Teams from './teams.jsx'
import User from './user.jsx'

import './info.css'

const Info = () => (
  <div className="info">
    <Hint />
    <Teams />
    <User />
  </div>
)

export default Info
