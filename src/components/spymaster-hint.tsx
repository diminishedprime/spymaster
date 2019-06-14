import React from "react";
import * as t from "./../types";
import R from "ramda";
import * as actions from "../redux/actions";
import * as lens from "../redux/lenses";
import { afUpdateHint, afSubmitHint } from "./../redux/actions";
import { connect } from "react-redux";

import NumberButton from "./number-button";

const spymasterStyle: React.CSSProperties = {
  minWidth: "6.5em",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px"
};

const NumberGroup = ({ numberGroup }: { numberGroup: t.HintNumber[] }) => {
  return (
    <div>
      {numberGroup.map((number: t.HintNumber) => {
        return <NumberButton key={number} number={number} />;
      })}
    </div>
  );
};

const numbers: t.HintNumber[] = ["Zero", 1, 2, 3, 4, 5, 6, 7, 8, "Infinity"];
const groupedNumbers = R.splitEvery(5, numbers);

const Numbers = ({ groupedNumbers }: { groupedNumbers: t.HintNumber[][] }) => {
  return (
    <div>
      {groupedNumbers.map((group, idx) => {
        return <NumberGroup key={idx} numberGroup={group} />;
      })}
    </div>
  );
};

interface DispatchProps {
  submitHint: () => void;
  onChange: (a: { target: { value: string } }) => void;
}

type AllProps = DispatchProps;

const mapDispatchToProps = (dispatch: t.Dispatch): DispatchProps => {
  const updateHint = (hint: string) => {
    return dispatch(afUpdateHint(hint));
  };
  const submitHint = () => {
    return dispatch(afSubmitHint());
  };

  const onChange = ({ target: { value } }: { target: { value: string } }) => {
    return updateHint(value);
  };

  return {
    submitHint,
    onChange
  };
};

const SpymasterHint: React.FC<AllProps> = ({ onChange, submitHint }) => {
  const text: string = actions.useLens(lens.hintText);
  const number = actions.useLens(lens.hintNumber);
  const hintSubmitted: boolean = actions.useLens(lens.hintSubmitted);
  const playerTeam = actions.useLens(lens.team);
  const currentTeam = actions.useLens(lens.currentTeam);
  const inputDisabled = playerTeam !== currentTeam;
  const submitDisabled: boolean =
    text === "" || number + "" === "" || inputDisabled || hintSubmitted;
  const style: React.CSSProperties = actions.useLens(
    lens.teamStyle(currentTeam)
  );

  return (
    <div style={R.merge(spymasterStyle, style)}>
      <input value={text} onChange={onChange} disabled={inputDisabled} />
      <Numbers groupedNumbers={groupedNumbers} />
      <button disabled={submitDisabled} onClick={submitHint}>
        Submit
      </button>
    </div>
  );
};

export default connect(
  undefined,
  mapDispatchToProps
)(SpymasterHint);
