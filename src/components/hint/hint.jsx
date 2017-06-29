import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'

import {
  currentTeamPath,
  backgroundColorPath,
  hintSubmittedPath,
  hintTextPath,
  hintNumberPath,
  rolePath,
} from '../../redux/paths.js'
import {
  fgColorForRGB,
  hexToRGB,
} from '../../util.js'
import font from '../font.css'
import Forfeit from '../info/forfeit.jsx'
import i from '../info/info.css'

import SpymasterHint from './spymaster-hint.jsx'
import s from './hint.css'


const mapStateToProps = (state) => {
  const text = R.view(hintTextPath, state)
  const number = R.view(hintNumberPath, state)
  const role = R.view(rolePath, state)
  const hintSubmitted = R.view(hintSubmittedPath, state)
  const isAgent = role === 'agent'
  const showAgent = isAgent || hintSubmitted
  const team = R.view(currentTeamPath, state)
  const bgColor = R.view(backgroundColorPath(team), state)
  const fgColor = fgColorForRGB(hexToRGB(bgColor))
  const style = {
    color: fgColor,
    backgroundColor: bgColor,
  }

  return ({
    showAgent,
    text,
    number,
    hintSubmitted,
    style,
  })
}

const AgentHint = connect(
  mapStateToProps
)(({hintSubmitted, text, number, style}) => (
  <div className={s.hint + ' ' + i.infoBaby} style={style}>
    {!hintSubmitted && <div>Awaiting Hint</div>}
    {hintSubmitted && <div>Hint</div>}
    {hintSubmitted && <div className={font.largeText}>{text}</div>}
    {hintSubmitted && <div className={font.largeText}>{number}</div>}
    <Forfeit />
  </div>
))

const Hint = connect(
  mapStateToProps
)(({showAgent}) => showAgent ? <AgentHint /> : <SpymasterHint />)

export default Hint
