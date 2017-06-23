import React from 'react'
import { connect } from 'react-redux'
import ErrorBar from '../error-bar/error-bar.jsx'
import Game from '../game/game.jsx'
import { afToggleTitle } from '../../redux.js'
import './app.css'

const App = ({hasError, showTitle, toggleTitle}) => (
  <div className="app">
    {hasError && <ErrorBar />}
    {showTitle && <div className="title" onClick={toggleTitle}>Spymaster</div>}
    <Game />
  </div>
)
const mapStateToProps = ({
  error: {text: hasError},
  settings: {showTitle},
}) => ({
  hasError,
  showTitle,
})

const mapDispatchToProps = (dispatch) => ({
  toggleTitle: () => dispatch(afToggleTitle()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
