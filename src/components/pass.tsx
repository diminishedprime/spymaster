import React from "react";
import * as t from "./../types";
import { connect } from "react-redux";
import { afNextTurn } from "./../redux/actions";
import * as actions from "../redux/actions";
import * as lens from "../redux/lenses";

interface DispatchProps {
  pass: () => void;
}

type AllProps = DispatchProps;

const mapDispatchToProps = (dispatch: t.Dispatch): DispatchProps => {
  return {
    pass: () => {
      return dispatch<t.NextTurn>(afNextTurn());
    }
  };
};

const Pass: React.FC<AllProps> = ({ pass }) => {
  const playerTeam = actions.useLens(lens.team);
  const currentTeam = actions.useLens(lens.currentTeam);
  const disabled = playerTeam !== currentTeam;
  return (
    <button disabled={disabled} onClick={pass}>
      Pass Turn
    </button>
  );
};

export default connect(
  undefined,
  mapDispatchToProps
)(Pass);
