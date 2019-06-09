import React from "react";
import * as t from "./../types";
import R from "ramda";
import { connect } from "react-redux";

import {
  rolePath,
  teamPath,
  styleForTeamPath,
  usernamePath
} from "./../redux/paths";
import { largeTextStyle } from "./commonStyles";

import Score from "./score";

const userStyle: React.CSSProperties = {
  minWidth: "6.5em",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
};

const userRowStyle: React.CSSProperties = {
  width: "100%",
  paddingBottom: "5px",
  paddingTop: "5px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const flexStyle: React.CSSProperties = {
  display: "flex"
};

const infoBabyStyle: React.CSSProperties = {
  width: "12em",
  marginLeft: "5px",
  marginRight: "5px",
  marginTop: "10px"
};

interface StateProps {
  style: React.CSSProperties;
  role: t.Role;
  username: string;
}

type AllProps = StateProps;

const mapStateToProps = (state: t.ReduxState): StateProps => {
  const role: t.Role = R.view(rolePath, state);
  const team: t.Team = R.view(teamPath, state);
  const style: React.CSSProperties = R.view(styleForTeamPath(team), state);
  return {
    style,
    role: role,
    username: R.view(usernamePath, state)
  };
};

const User: React.FC<AllProps> = ({ role, username, style }) => (
  <div style={R.merge(flexStyle, infoBabyStyle)}>
    <div style={R.merge(style, userStyle)}>
      <div style={userRowStyle}>
        <div>Role</div>
        <div style={largeTextStyle}>{role}</div>
      </div>
      <div style={userRowStyle}>
        <div>Username</div>
        <div style={largeTextStyle}>{username}</div>
      </div>
    </div>
    <Score />
  </div>
);

export default connect(mapStateToProps)(User);
