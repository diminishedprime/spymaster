import React from "react";
import * as t from "./../types";
import R from "ramda";
import styled from "styled-components";
import * as actions from "../redux/actions";
import * as paths from "./../redux/paths";

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
  color: ${({ severity }) =>
    severity === t.Severity.ERROR ? "white" : "black"};
  background-color: ${({ severity }) =>
    severity === t.Severity.ERROR ? "#DE0707" : "#FFDD00"};
`;

const ErrorBar: React.FC = () => {
  const severity = actions.useSelector<t.Severity>(
    R.view(paths.errorSeverityPath)
  );
  const text = actions.useSelector<string>(R.view(paths.errorTextPath));
  const { dismissError } = actions.useApi();
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
