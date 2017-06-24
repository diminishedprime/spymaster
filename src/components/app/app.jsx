import React from 'react'
import { connect } from 'react-redux'
import ErrorBar from '../error-bar/error-bar.jsx'
import Game from '../game/game.jsx'
import { afToggleTitle } from '../../redux.js'
import { CirclePicker } from 'react-color'
import { afChangeColor } from '../../redux.js'
import './app.css'

const colorForRGB = ({red, green, blue}) =>
  (red*0.299 + green*0.587 + blue*0.114) > 186 ? '#000000' : '#ffffff'

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return {
    red: parseInt(result[1], 16),
    green: parseInt(result[2], 16),
    blue: parseInt(result[3], 16),
  }
}

const TeamRow = connect(
  (state, {team}) => ({color: state.team[team].color}),
  (dispatch, {team}) => ({
    onColorChange: ({hex}) => dispatch(afChangeColor(team, hex)),
  })
)(({onColorChange, color}) => (
  <div className="teamRow">
    <div className="teamButtons">
      <button style={{
        backgroundColor: color,
        color: colorForRGB(hexToRgb(color)),
      }}>Spymaster</button>
      <button style={{
        backgroundColor: color,
        color: colorForRGB(hexToRgb(color)),
      }}>Agent</button>
    </div>
    <CirclePicker onChangeComplete={onColorChange}
                  color={color}/>
  </div>
))

const PickTeam = () => (
  <div className="pickTeam" >
    <TeamRow team="1" />
    <TeamRow team="2" />
  </div>
)

const App = ({hasError, showTitle, toggleTitle, gameMode}) => (
  <div className="app">
    {hasError && <ErrorBar />}
    {showTitle && <div className="title" onClick={toggleTitle}>Spymaster</div>}
    {gameMode === 'game' && <Game />}
    {gameMode === 'pick team' && <PickTeam />}

  </div>
)
const mapStateToProps = ({
  error: {text: hasError},
  settings: {showTitle},
  gameMode,
}) => ({
  hasError,
  showTitle,
  gameMode,
})

const mapDispatchToProps = (dispatch) => ({
  toggleTitle: () => dispatch(afToggleTitle()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
