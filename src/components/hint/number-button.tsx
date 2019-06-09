import React from "react";
import * as t from "../../types";
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

interface OwnProps {
  number: t.HintNumber;
}

interface StateProps {
  disabled: boolean;
  style: React.CSSProperties;
}

interface DispatchProps {
  setHintNumber: () => void;
}

type AllProps = StateProps & DispatchProps & OwnProps;

const mapStateToProps = (state: t.ReduxState, { number }: OwnProps) => {
  const cardTeam: t.Team = R.view(teamPath, state);
  const selectedNumber = R.view(hintNumberPath, state);
  const numberPicked = selectedNumber === number;
  const playerTeam = R.view(teamPath, state);
  const currentTeam = R.view(currentTeamPath, state);
  const hintSubmitted: boolean = R.view(hintSubmittedPath, state);
  const disabled: boolean =
    numberPicked || playerTeam !== currentTeam || hintSubmitted;
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

const mapDispatchToProps = (
  dispatch: t.Dispatch,
  { number }: OwnProps
): DispatchProps => ({
  setHintNumber: () => dispatch(afUpdateHintNumber(number))
});

const NumberButton: React.FC<AllProps> = ({
  number,
  disabled,
  style,
  setHintNumber
}) => (
  <button
    key={number}
    disabled={disabled}
    style={style}
    onClick={setHintNumber}
  >
    {number}
  </button>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NumberButton);
