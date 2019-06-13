import React from "react";
import R from "ramda";
import { SPYMASTER } from "./../constants";
import { largeTextStyle } from "./commonStyles";
import * as actions from "../redux/actions";
import * as lens from "../redux/lenses";

import Pass from "./pass";

const teamsStyle = {
  minWidth: "6.5em",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
};

const teamsRowStyle = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const infoBabyStyle = {
  width: "12em",
  marginLeft: "5px",
  marginRight: "5px",
  marginTop: "10px"
};

const Teams: React.FC = () => {
  const role = actions.useLensSelector(lens.role);
  const currentTeam = actions.useLensSelector(lens.currentTeam);
  const yourTeam = actions.useLensSelector(lens.team);
  const yourTeamStyle = actions.useLensSelector(lens.teamStyle(yourTeam));
  const currentTeamStyle = actions.useLensSelector(lens.teamStyle(currentTeam));
  return (
    <div style={R.merge(teamsStyle, infoBabyStyle)}>
      <div style={R.merge(teamsRowStyle, currentTeamStyle)}>
        <div>Current Team</div>
        <div style={largeTextStyle}>{currentTeam}</div>
      </div>
      <div style={R.merge(teamsRowStyle, yourTeamStyle)}>
        <div>Your Team</div>
        <div style={largeTextStyle}>{yourTeam}</div>
        {role !== SPYMASTER && <Pass />}
      </div>
    </div>
  );
};

export default Teams;
