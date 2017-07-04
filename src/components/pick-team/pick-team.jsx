import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'
import {
  CirclePicker,
} from 'react-color'

import {
  AGENT,
  SPYMASTER,
} from '../../constants.js'
import {
  afChangeColor,
  afPickRole,
} from '../../redux/actions.js'
import {
  styleForTeamPath,
  backgroundColorForTeamPath,
} from '../../redux/paths.js'

import s from './pick-team.css'

const StyledButton = ({style, text, onClick}) => (
  <button onClick={onClick} style={style} >
    {text}
  </button>
)

const TeamRow = connect(
  (state, {team}) => ({
    style: R.view(styleForTeamPath(team), state),
    backgroundColor: R.view(backgroundColorForTeamPath(team), state),
  }),
  (dispatch, {team}) => ({
    onColorChange: ({hex}) => dispatch(afChangeColor(team, hex)),
    pickRole: (role) => () => dispatch(afPickRole(team, role)),
  })
)(({onColorChange, style, pickRole, backgroundColor}) => (
  <div className={s.teamRow}>
    <div className={s.teamButtons}>
      <StyledButton text={SPYMASTER}
                    style={style}
                    onClick={pickRole(SPYMASTER)}
      />
      <StyledButton text={AGENT}
                    style={style}
                    onClick={pickRole(AGENT)}
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
