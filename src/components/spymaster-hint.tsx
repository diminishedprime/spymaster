import React from "react";
import * as t from "./../types";
import R from "ramda";
import { connect } from "react-redux";

import {
  styleForTeamPath,
  hintSubmittedPath,
  hintTextPath,
  hintNumberPath,
  teamPath,
  currentTeamPath
} from "./../redux/paths";
import { afUpdateHint, afSubmitHint } from "./../redux/actions";

import NumberButton from "./number-button";

const spymasterStyle: React.CSSProperties = {
  minWidth: "6.5em",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px"
};

const NumberGroup = ({ numberGroup }: { numberGroup: t.HintNumber[] }) => (
  <div>
    {numberGroup.map((number: t.HintNumber) => (
      <NumberButton key={number} number={number} />
    ))}
  </div>
);

const numbers: t.HintNumber[] = ["Zero", 1, 2, 3, 4, 5, 6, 7, 8, "Infinity"];
const groupedNumbers = R.splitEvery(5, numbers);

const Numbers = ({ groupedNumbers }: { groupedNumbers: t.HintNumber[][] }) => (
  <div>
    {groupedNumbers.map((group, idx) => (
      <NumberGroup key={idx} numberGroup={group} />
    ))}
  </div>
);

interface StateProps {
  style: React.CSSProperties;
  text: string;
  number: string;
  submitDisabled: boolean;
  inputDisabled: boolean;
}

interface DispatchProps {
  submitHint: () => void;
  onChange: (a: { target: { value: string } }) => void;
}

type AllProps = DispatchProps & StateProps;

const mapStateToProps = (state: t.ReduxState): StateProps => {
  const text: string = R.view(hintTextPath, state);
  const number: string = R.view(hintNumberPath, state);
  const hintSubmitted: boolean = R.view(hintSubmittedPath, state);
  const playerTeam = R.view(teamPath, state);
  const currentTeam = R.view(currentTeamPath, state);
  const inputDisabled = playerTeam !== currentTeam;
  const submitDisabled: boolean =
    text === "" || number === "" || inputDisabled || hintSubmitted;
  const team: t.Team = R.view(currentTeamPath, state);
  const style: React.CSSProperties = R.view(styleForTeamPath(team), state);

  return {
    style,
    text,
    number,
    submitDisabled,
    inputDisabled
  };
};

const mapDispatchToProps = (dispatch: t.Dispatch): DispatchProps => {
  const updateHint = (hint: string) => dispatch(afUpdateHint(hint));
  const submitHint = () => dispatch(afSubmitHint());

  const onChange = ({ target: { value } }: { target: { value: string } }) =>
    updateHint(value);

  return {
    submitHint,
    onChange
  };
};

const SpymasterHint: React.FC<AllProps> = ({
  text,
  inputDisabled,
  onChange,
  submitDisabled,
  submitHint,
  style
}) => (
  <div style={R.merge(spymasterStyle, style)}>
    <input value={text} onChange={onChange} disabled={inputDisabled} />
    <Numbers groupedNumbers={groupedNumbers} />
    <button disabled={submitDisabled} onClick={submitHint}>
      Submit
    </button>
  </div>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpymasterHint);
