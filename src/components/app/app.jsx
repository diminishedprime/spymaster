import React from 'react'
import { connect } from 'react-redux'
import ErrorBar from '../error-bar/error-bar.jsx'
import Counter from '../counter/counter.jsx'
import './app.css'

const App = ({hi, hasError}) => (
  <div className="app">
    {hasError && <ErrorBar />}
    <div className="title">Best Counter</div>
    <div className="content">
      <Counter />
      {hi.map((text, idx) => (
        <div className="hi" key={idx}>{text}</div>
      ))}
    </div>
  </div>
)
const mapStateToProps = ({hi, error: {text: hasError}}) => ({
  hi,
  hasError,
})

export default connect(
  mapStateToProps
)(App)
