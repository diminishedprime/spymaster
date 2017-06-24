import React from 'react'
import { connect } from 'react-redux'
import ErrorBar from '../error-bar/error-bar.jsx'
import Game from '../game/game.jsx'
import { CirclePicker } from 'react-color'
import { afChangeColor, afPickRole, afToggleTitle } from '../../redux/actions.js'
import { fgColorForRGB, hexToRGB } from '../../util.js'
import paths from '../../redux/paths.js'
import R from 'ramda'
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
  (state, {team}) => ({
    backgroundColor: R.view(paths.backgroundColorPath(team), state),
  }),
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
const mapStateToProps = (state) => ({
  hasError: R.view(paths.errorTextPath, state),
  showTitle: R.view(paths.showTitlePath, state),
  gameMode: R.view(paths.gameModePath, state),
})

const mapDispatchToProps = (dispatch) => ({
  toggleTitle: () => dispatch(afToggleTitle()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
