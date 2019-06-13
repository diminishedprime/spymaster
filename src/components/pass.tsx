import React from "react";
import * as t from "./../types";
import R from "ramda";
import { connect } from "react-redux";

import { currentTeamPath, teamPath } from "./../redux/paths";
import { afNextTurn } from "./../redux/actions";

interface StateProps {
  disabled: boolean;
}

interface DispatchProps {
  pass: () => void;
}

type AllProps = StateProps & DispatchProps;

const mapStateToProps = (state: t.ReduxState): StateProps => {
  const playerTeam = R.view(teamPath, state);
  const currentTeam = R.view(currentTeamPath, state);
  const disabled = playerTeam !== currentTeam;

  return {
    disabled
  };
};

const mapDispatchToProps = (dispatch: t.Dispatch): DispatchProps => {
  return {
    pass: () => {
      return dispatch<t.NextTurn>(afNextTurn());
    }
  };
};

const Pass: React.FC<AllProps> = ({ pass, disabled }) => {
  return (
    <button disabled={disabled} onClick={pass}>
      Pass Turn
    </button>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pass);
