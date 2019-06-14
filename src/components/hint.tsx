import React from "react";
import * as t from "./../types";
import R from "ramda";
import Forfeit from "./forfeit";
import * as actions from "../redux/actions";
import * as lens from "../redux/lenses";

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

const AgentHint: React.FC = () => {
  const text = actions.useLens(lens.hintText);
  const number = actions.useLens(lens.hintNumber);
  const team = actions.useMLens(t.lens.reduxState.localState.playerType);
  const style = actions.useLens(lens.teamStyle(team));
  const hintSubmitted = actions.useLens(lens.hintSubmitted);
  return (
    <div style={R.merge(infoBabyStyle, R.merge(hintStyle, style))}>
      {!hintSubmitted && <div>Awaiting Hint</div>}
      {hintSubmitted && <div>Hint</div>}
      {hintSubmitted && <div className={"largeText"}>{text}</div>}
      {hintSubmitted && <div className={"largeText"}>{number}</div>}
      <Forfeit team={team} />
    </div>
  );
};

const Hint = () => {
  const hintSubmitted = actions.useLens(lens.hintSubmitted);
  const role = actions.useLens(lens.role);
  const isAgent = role === t.Role.AGENT;
  const showAgent = isAgent || hintSubmitted;
  return showAgent ? <AgentHint /> : <SpymasterHint />;
};

export default Hint;
