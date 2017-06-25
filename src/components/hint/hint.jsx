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

const mapStateToProps = (state) => {
  const text = R.view(paths.hintTextPath, state)
  const number = R.view(paths.hintNumberPath, state)
  const role = R.view(paths.rolePath, state)
  const hintSubmitted = R.view(paths.hintSubmittedPath, state)
  const playerTeam = R.view(paths.teamPath, state)
  const currentTeam = R.view(paths.currentTeamPath, state)
  const inputDisabled = (playerTeam !== currentTeam)
  const submitDisabled = (text === '') ||
                         (number === '') ||
                         inputDisabled ||
                         hintSubmitted
  return ({
    text,
    number,
    role,
    hintSubmitted,
    submitDisabled,
    inputDisabled,
  })
}

const Hint = connect(
  mapStateToProps,
  (dispatch) => ({
    updateHint: (hint) => dispatch(afUpdateHint(hint)),
    submitHint: () => dispatch(afEmitAction(afSubmitHint())),
  })
)(({
  text,
  number,
  role,
  updateHint,
  hintSubmitted,
  submitHint,
  submitDisabled,
  inputDisabled,
}) => (
  <div>
    {
      (role === 'agent' || hintSubmitted)
        ? (
          <div className="infoColumn">
            {!hintSubmitted && <div>Awaiting Hint</div>}
            {hintSubmitted && <div>Hint</div>}
            {hintSubmitted && <div className="infoColumnValue">{text}</div>}
            {hintSubmitted && <div className="infoColumnValue">{number}</div>}
          </div>
        )
        : (
          <div className="infoColumn">
            <input value={text}
              onChange={({target: {value}}) => updateHint(value)}
              disabled={inputDisabled}
            />
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
            <button disabled={submitDisabled}
              onClick={submitHint}>
        Submit
            </button>
          </div>
        )
    }
  </div>
))

export default Hint
