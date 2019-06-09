import React from "react";
import * as t from "./../types";
import R from "ramda";
import { connect } from "react-redux";

import { SPYMASTER } from "./../constants";
import {
  teamPath,
  styleForTeamPath,
  currentTeamPath,
  rolePath
} from "./../redux/paths";
import { largeTextStyle } from "./commonStyles";

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

interface StateProps {
  yourTeam: t.Team;
  currentTeam: t.Team;
  currentTeamStyle: React.CSSProperties;
  yourTeamStyle: React.CSSProperties;
  role: t.Role;
}
type AllProps = StateProps;

const mapStateToProps = (state: t.ReduxState): StateProps => {
  const role: t.Role = R.view(rolePath, state);
  const currentTeam: t.Team = R.view(currentTeamPath, state);
  const yourTeam: t.Team = R.view(teamPath, state);
  const yourTeamStyle: React.CSSProperties = R.view(
    styleForTeamPath(yourTeam),
    state
  );
  const currentTeamStyle: React.CSSProperties = R.view(
    styleForTeamPath(currentTeam),
    state
  );

  return {
    yourTeam,
    currentTeam,
    currentTeamStyle,
    yourTeamStyle,
    role
  };
};
const Teams: React.FC<AllProps> = ({
  currentTeamStyle,
  yourTeamStyle,
  yourTeam,
  currentTeam,
  role
}) => (
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

export default connect(mapStateToProps)(Teams);
