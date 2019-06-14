import React from "react";
import * as t from "./../types";
import styled from "styled-components";
import * as actions from "../redux/actions";

const DismissWrapper = styled.div`
  cursor: pointer;
  margin-left: auto;
`;

const ErrorWrapper = styled.div<{ severity: t.Severity }>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  padding: 5px;
  color: ${({ severity }) => {
    return severity === t.Severity.ERROR ? "white" : "black";
  }};
  background-color: ${({ severity }) => {
    return severity === t.Severity.ERROR ? "#DE0707" : "#FFDD00";
  }};
`;

const ErrorBar: React.FC = () => {
  const error = actions.useMLens(t.lens.reduxState.localState.error);
  const { dismissError } = actions.useApi();
  if (error.isNone()) {
    return null;
  }
  const severity = error.value.severity;
  const text = error.value.severity;
  return (
    <ErrorWrapper severity={severity}>
      <div>{text}</div>
      <DismissWrapper onClick={dismissError} title="dismiss">
        &times;
      </DismissWrapper>
    </ErrorWrapper>
  );
};

export default ErrorBar;
