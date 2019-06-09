import React from "react";
import * as t from "../../types";
import R from "ramda";
import { connect } from "react-redux";

import { afDismissError } from "../../redux/actions";
import { errorPath } from "../../redux/paths";

const errorBarStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "2em",
  padding: "5px"
};

const errorStyle: React.CSSProperties = {
  backgroundColor: "#DE0707",
  color: "white"
};

const warnStyle: React.CSSProperties = {
  backgroundColor: "#FFDD00",
  color: "black"
};

const dismissStyle: React.CSSProperties = {
  cursor: "pointer",
  marginLeft: "auto"
};

type AllProps = DispatchProps & StateProps;

interface DispatchProps {
  dismiss: () => void;
}

interface StateProps {
  text: string;
  severity: t.Severity;
}

const mapStateToProps = (state: t.ReduxState): StateProps => {
  // TODO - this should be typed better once I type out the whole store.
  const error: StateProps = R.view(errorPath, state);
  return {
    ...error
  };
};

const mapDispatchToProps = (dispatch: t.Dispatch): DispatchProps => ({
  dismiss: () => dispatch(afDismissError())
});

const ErrorBar: React.FC<AllProps> = ({ text, severity, dismiss }) => {
  let baseStyle: React.CSSProperties = {};
  if (severity === t.Severity.ERROR) {
    baseStyle = errorStyle;
  } else if (severity === t.Severity.WARN) {
    baseStyle = warnStyle;
  }
  const style = R.merge(errorBarStyle, baseStyle);
  return (
    <div style={style}>
      <div>{text}</div>
      <div style={dismissStyle} onClick={dismiss} title="dismiss">
        &times;
      </div>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorBar);
