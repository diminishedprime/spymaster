import React from "react";
import R from "ramda";
import { connect } from "react-redux";

import {
  styleForTeamPath,
  hintSubmittedPath,
  hintTextPath,
  hintNumberPath,
  teamPath,
  currentTeamPath
} from "../../redux/paths";
import { afUpdateHint, afSubmitHint } from "../../redux/actions";

import NumberButton from "./number-button";

const spymasterStyle = {
  minWidth: "6.5em",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px"
};

const NumberGroup = ({ numberGroup }) => (
  <div>
    {numberGroup.map(number => (
      <NumberButton key={number} number={number} />
    ))}
  </div>
);

const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "inf"];
const groupedNumbers = R.splitEvery(5, numbers);

const Numbers = ({ groupedNumbers }) => (
  <div>
    {groupedNumbers.map((group, idx) => (
      <NumberGroup key={idx} numberGroup={group} />
    ))}
  </div>
);

const mapStateToProps = state => {
  const text = R.view(hintTextPath, state);
  const number = R.view(hintNumberPath, state);
  const hintSubmitted = R.view(hintSubmittedPath, state);
  const playerTeam = R.view(teamPath, state);
  const currentTeam = R.view(currentTeamPath, state);
  const inputDisabled = playerTeam !== currentTeam;
  const submitDisabled =
    text === "" || number === "" || inputDisabled || hintSubmitted;
  const team = R.view(currentTeamPath, state);
  const style = R.view(styleForTeamPath(team), state);

  return {
    style,
    text,
    number,
    submitDisabled,
    inputDisabled
  };
};

const mapDispatchToProps = dispatch => {
  const updateHint = hint => dispatch(afUpdateHint(hint));
  const submitHint = () => dispatch(afSubmitHint());

  const onChange = ({ target: { value } }) => updateHint(value);

  return {
    submitHint,
    onChange
  };
};

const SpymasterHint = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ text, inputDisabled, onChange, submitDisabled, submitHint, style }) => (
  <div style={R.merge(spymasterStyle, style)}>
    <input value={text} onChange={onChange} disabled={inputDisabled} />
    <Numbers groupedNumbers={groupedNumbers} />
    <button disabled={submitDisabled} onClick={submitHint}>
      Submit
    </button>
  </div>
));

export default SpymasterHint;
