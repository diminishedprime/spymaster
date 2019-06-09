import React from "react";
import * as t from "./../types";
import R from "ramda";
import { connect } from "react-redux";

import {
  currentTeamPath,
  styleForTeamPath,
  hintSubmittedPath,
  hintTextPath,
  hintNumberPath,
  rolePath
} from "./../redux/paths";
/* import font from "./font.css"; */
import Forfeit from "./forfeit";

import SpymasterHint from "./spymaster-hint";

const hintStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
};

const infoBabyStyle: React.CSSProperties = {
  width: "12em",
  marginLeft: "5px",
  marginRight: "5px",
  marginTop: "10px"
};

interface StateProps {
  showAgent: boolean;
  text: string;
  number: t.HintNumber;
  hintSubmitted: boolean;
  style: React.CSSProperties;
}

type AllProps = StateProps;

const mapStateToProps = (state: t.ReduxState): StateProps => {
  const text: string = R.view(hintTextPath, state);
  const number: t.HintNumber = R.view(hintNumberPath, state);
  const role: t.Role = R.view(rolePath, state);
  const hintSubmitted: boolean = R.view(hintSubmittedPath, state);
  const isAgent: boolean = role === t.Role.AGENT;
  const showAgent: boolean = isAgent || hintSubmitted;
  const team: t.Team = R.view(currentTeamPath, state);
  const style: React.CSSProperties = R.view(styleForTeamPath(team), state);

  return {
    showAgent,
    text,
    number,
    hintSubmitted,
    style
  };
};

const AgentHint: React.FC<AllProps> = ({
  hintSubmitted,
  text,
  number,
  style
}) => (
  <div style={R.merge(infoBabyStyle, R.merge(hintStyle, style))}>
    {!hintSubmitted && <div>Awaiting Hint</div>}
    {hintSubmitted && <div>Hint</div>}
    {hintSubmitted && <div className={"largeText"}>{text}</div>}
    {hintSubmitted && <div className={"largeText"}>{number}</div>}
    <Forfeit />
  </div>
);

const ConnectedAgentHint = connect(mapStateToProps)(AgentHint);

const Hint = connect(mapStateToProps)(({ showAgent }) =>
  showAgent ? <ConnectedAgentHint /> : <SpymasterHint />
);

export default Hint;
