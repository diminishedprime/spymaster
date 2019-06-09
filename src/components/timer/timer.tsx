import React from "react";
import * as t from "../../types";
import R from "ramda";
import { connect } from "react-redux";

import { afStartTimer } from "../../redux/actions";
import { timePath, hintSubmittedPath } from "../../redux/paths";

const timerStyle = {
  display: "flex",
  justifyContent: "cente"
};

interface StateProps {
  time: number;
  disabled: boolean;
}

interface DispatchProps {
  start: () => void;
}

type AllProps = DispatchProps & StateProps;

const mapStateToProps = (state: t.ReduxState): StateProps => {
  const time: number = R.view(timePath, state);
  const hintSubmitted = R.view(hintSubmittedPath, state);
  const disabled = !hintSubmitted;
  return {
    time,
    disabled
  };
};

const mapDispatchToProps = (dispatch: t.Dispatch): DispatchProps => ({
  start: () => dispatch(afStartTimer())
});

const Timer: React.FC<AllProps> = ({ time, start, disabled }) => (
  <div style={timerStyle}>
    {time ? (
      <div>Time Remaining: {time} </div>
    ) : (
      <button onClick={start} disabled={disabled}>
        Start Timer
      </button>
    )}
  </div>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timer);
