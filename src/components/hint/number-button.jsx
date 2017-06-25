import React from 'react'
import R from 'ramda'
import paths from '../../redux/paths.js'
import { afUpdateHintNumber } from '../../redux/actions.js'
import { afEmitAction } from '../../sagas/connect-to-websocket.js'
import { connect } from 'react-redux'
import { fgColorForRGB, hexToRGB } from '../../util.js'

const mapStateToProps = (state, {number}) => {
  const cardTeam = R.view(paths.teamPath, state)
  const disabled = R.view(paths.hintNumberPath, state) === number
  const bgColor = R.view(paths.backgroundColorPath(cardTeam), state)
  const baseStyle = {
    color: '#000000',
    backgroundColor: '#ffffff',
  }
  const style = (disabled)
              ? R.compose(
                R.assoc('color', fgColorForRGB(hexToRGB(bgColor))),
                R.assoc('backgroundColor', bgColor)
              )(baseStyle)
              : baseStyle
  return ({
    disabled,
    style,
  })
}

const mapDispatchToProps = (dispatch, {number}) => ({
  setHintNumber: () => dispatch(afEmitAction(afUpdateHintNumber(number)))
})

const NumberButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(({number, disabled, style, setHintNumber}) => (
  <button className="hintButton"
          key={number}
          disabled={disabled}
          style={style}
          onClick={setHintNumber}
  >
    {number}
  </button>
))

export default NumberButton
