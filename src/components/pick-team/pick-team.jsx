import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'
import {
  CirclePicker,
} from 'react-color'

import {
  afChangeColor,
  afPickRole,
} from '../../redux/actions.js'
import {
  fgColorForRGB,
  hexToRGB,
} from '../../util.js'
import {
  afEmitAction,
} from '../../sagas/connect-to-websocket.js'
import {
  backgroundColorPath,
} from '../../redux/paths.js'

import s from './pick-team.css'

const StyledButton = ({backgroundColor, text, onClick}) => (
  <button onClick={onClick}
    style={{
      backgroundColor,
      color: fgColorForRGB(hexToRGB(backgroundColor)),
    }} >
    {text}
  </button>
)

const TeamRow = connect(
  (state, {team}) => ({
    backgroundColor: R.view(backgroundColorPath(team), state),
  }),
  (dispatch, {team}) => ({
    onColorChange: ({hex}) => dispatch(afEmitAction(afChangeColor(team, hex))),
    pickRole: (role) => () => dispatch(afPickRole(team, role)),
  })
)(({onColorChange, backgroundColor, pickRole}) => (
  <div className={s.teamRow}>
    <div className={s.teamButtons}>
      <StyledButton text="Spymaster"
                    backgroundColor={backgroundColor}
                    onClick={pickRole('spymaster')}
      />
      <StyledButton text="Agent"
                    backgroundColor={backgroundColor}
                    onClick={pickRole('agent')}
      />
    </div>
    <CirclePicker onChangeComplete={onColorChange}
                  color={backgroundColor}/>
  </div>
))

const PickTeam = () => (
  <div className={s.pickTeam} >
    <TeamRow team="1" />
    <TeamRow team="2" />
  </div>
)

export default PickTeam
