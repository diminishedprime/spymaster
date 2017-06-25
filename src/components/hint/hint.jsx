import React from 'react'
import R from 'ramda'
import paths from '../../redux/paths.js'
import {
  afUpdateHint,
  afSubmitHint,
} from '../../redux/actions.js'
import {
  afEmitAction,
} from '../../sagas/connect-to-websocket.js'
import { connect } from 'react-redux'
import NumberButton from './number-button.jsx'

const Hint = connect(
  (state) => ({
    text: R.view(paths.hintTextPath, state),
    number: R.view(paths.hintNumberPath, state),
    role: R.view(paths.rolePath, state),
    hintSubmitted: R.view(paths.hintSubmittedPath, state),
  }),
  (dispatch) => ({
    updateHint: (hint) => dispatch(afUpdateHint(hint)),
    submitHint: () => dispatch(afEmitAction(afSubmitHint())),
  })
)(({text, number, role, updateHint, hintSubmitted, submitHint}) => (
  <div>
    {
      (role === 'agent')
        ? (
          <div className="infoColumn">
            <div>Hint</div>
            {hintSubmitted && <div className="infoColumnValue">{text}</div>}
            {hintSubmitted && <div className="infoColumnValue">{number}</div>}
          </div>
        )
        : (
          <div className="infoColumn">
            {number}
            <input value={text}
              onChange={({target: {value}}) => updateHint(value)}/>
            <div className="numbers">
              {R.splitEvery(5, ['0', '1', '2', '3', '4', '5', '6', '7', '8', 'inf'])
                .map((group, idx) => (
                  <div key={idx}>
                    {
                      group
                        .map((number) => (
                          <NumberButton key={number} number={number} />
                        ))}
                  </div>
                ))
              }
            </div>
            <button onClick={submitHint}>Submit</button>
          </div>
        )
    }
  </div>
))

export default Hint
