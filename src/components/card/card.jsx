import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { afFlipCard } from '../../redux.js'
import { fgColorForRGB, hexToRGB } from '../../util.js'
import './card.css'

const mapStateToProps = (state, ownProps) => {
  const {colors} = state,
        {team: myTeam, flipped} = ownProps,
        bgColor = colors[myTeam].backgroundColor,
        baseStyle = {
          color: '#000000',
          backgroundColor: '#ffffff',
        },
        style = flipped
          ? R.compose(
            R.assoc('color', fgColorForRGB(hexToRGB(bgColor))),
            R.assoc('backgroundColor', bgColor)
          )(baseStyle)
          : baseStyle
  return {
    style,
  }
}

const mapDispatchToProps = (dispatch, {id}) => ({
  flip: () => dispatch(afFlipCard(id)),
})

const Card = ({text, style, flip}) => (
  <button className="card" style={style} onClick={flip}>
    {text}
  </button>
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Card)
