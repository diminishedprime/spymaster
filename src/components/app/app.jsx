import React from 'react'
import { connect } from 'react-redux'
import ErrorBar from '../error-bar/error-bar.jsx'
import Game from '../game/game.jsx'
import { afToggleTitle } from '../../redux.js'
import { CirclePicker } from 'react-color'
import { afChangeColor, afPickRole } from '../../redux.js'
import { fgColorForRGB, hexToRGB } from '../../util.js'
import './app.css'


/*
 * import {store} from '../../redux.js'
 * setTimeout(() => {
 *   store.dispatch(afPickRole('1', 'spymaster'))
 * }, 300)*/

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
  (state, {team}) => ({backgroundColor: state.colors[team].backgroundColor}),
  (dispatch, {team}) => ({
    onColorChange: ({hex}) => dispatch(afChangeColor(team, hex)),
    pickRole: (role) => () => dispatch(afPickRole(team, role)),
  })
)(({onColorChange, backgroundColor, pickRole}) => (
  <div className="teamRow">
    <div className="teamButtons">
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
  localState: {gameMode},
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
