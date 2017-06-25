import React from 'react'
import R from 'ramda'
import paths from '../../redux/paths.js'
import { afUpdateHint } from '../../redux/actions.js'
import { connect } from 'react-redux'
import NumberButton from './number-button.jsx'

const Hint = connect(
  (state) => ({
    text: R.view(paths.hintTextPath, state),
    role: R.view(paths.rolePath, state),
  }),
  (dispatch) => ({
    updateHint: (hint) => dispatch(afUpdateHint(hint)),
  })
)(({text, number, role, updateHint}) => (
  <div>
    {
      (role === 'agent')
        ? (
          <div className="infoColumn">
            <div>Hint</div>
            <div className="infoColumnValue">{text}</div>
            <div className="infoColumnValue">{number}</div>
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
          </div>
        )
    }
  </div>
))

export default Hint
