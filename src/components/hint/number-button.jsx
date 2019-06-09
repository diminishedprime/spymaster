import React from "react";
import R from "ramda";
import { connect } from "react-redux";

import {
  hintSubmittedPath,
  hintNumberPath,
  teamPath,
  styleForTeamPath,
  currentTeamPath
} from "../../redux/paths";
import { afUpdateHintNumber } from "../../redux/actions";

const mapStateToProps = (state, { number }) => {
  const cardTeam = R.view(teamPath, state);
  const selectedNumber = R.view(hintNumberPath, state);
  const numberPicked = selectedNumber === number;
  const playerTeam = R.view(teamPath, state);
  const currentTeam = R.view(currentTeamPath, state);
  const hintSubmitted = R.view(hintSubmittedPath, state);
  const disabled = numberPicked || playerTeam !== currentTeam || hintSubmitted;
  const baseStyle = {
    color: "#000000",
    backgroundColor: "#ffffff"
  };
  const styleForTeam = R.view(styleForTeamPath(cardTeam), state);
  const style = numberPicked ? styleForTeam : baseStyle;
  return {
    disabled,
    style: R.merge(style, {
      margin: "2px",
      minWidth: "30px"
    })
  };
};

const mapDispatchToProps = (dispatch, { number }) => ({
  setHintNumber: () => dispatch(afUpdateHintNumber(number))
});

const NumberButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ number, disabled, style, setHintNumber }) => (
  <button
    key={number}
    disabled={disabled}
    style={style}
    onClick={setHintNumber}
  >
    {number}
  </button>
));

export default NumberButton;
