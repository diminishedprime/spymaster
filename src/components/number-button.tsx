import React from "react";
import * as t from "./../types";
import { connect } from "react-redux";
import * as actions from "../redux/actions";
import * as lens from "../redux/lenses";
import { afUpdateHintNumber } from "./../redux/actions";

interface OwnProps {
  number: t.HintNumber;
}

interface DispatchProps {
  setHintNumber: () => void;
}

type AllProps = DispatchProps & OwnProps;

const mapDispatchToProps = (
  dispatch: t.Dispatch,
  { number }: OwnProps
): DispatchProps => {
  return {
    setHintNumber: () => {
      return dispatch<t.UpdateHintNumber>(afUpdateHintNumber(number));
    }
  };
};

const NumberButton: React.FC<AllProps> = ({ number, setHintNumber }) => {
  const selectedNumber = actions.useLens(lens.hintNumber);
  const numberPicked = selectedNumber === number;
  const playerTeam = actions.useLens(lens.team);
  const currentTeam = actions.useLens(lens.currentTeam);
  const hintSubmitted: boolean = actions.useLens(lens.hintSubmitted);
  const disabled: boolean =
    numberPicked || playerTeam !== currentTeam || hintSubmitted;
  const baseStyle = {
    color: "#000000",
    backgroundColor: "#ffffff"
  };
  const styleForTeam = actions.useLens(lens.teamStyle(currentTeam));
  const style = numberPicked ? styleForTeam : baseStyle;
  return (
    <button
      key={number}
      disabled={disabled}
      style={style}
      onClick={setHintNumber}
    >
      {number}
    </button>
  );
};

export default connect(
  undefined,
  mapDispatchToProps
)(NumberButton);
