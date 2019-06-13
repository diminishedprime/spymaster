import React from "react";
import * as t from "./../types";
import { connect } from "react-redux";
import * as actions from "../redux/actions";
import * as lens from "../redux/lenses";
import { afStartTimer } from "./../redux/actions";

const timerStyle = {
  display: "flex",
  justifyContent: "cente"
};

interface DispatchProps {
  start: () => void;
}

type AllProps = DispatchProps;

const mapDispatchToProps = (dispatch: t.Dispatch): DispatchProps => ({
  start: () => dispatch(afStartTimer())
});

const Timer: React.FC<AllProps> = ({ start }) => {
  const time = actions.useLensSelector(lens.time);
  const disabled = !actions.useLensSelector(lens.hintSubmitted);
  return (
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
};

export default connect(
  undefined,
  mapDispatchToProps
)(Timer);
