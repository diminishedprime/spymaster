import React from "react";
import R from "ramda";
import { connect } from "react-redux";

import {
  rolePath,
  teamPath,
  styleForTeamPath,
  usernamePath
} from "../../redux/paths";
import { largeTextStyle } from "../commonStyles";

import Score from "./score";

const userStyle = {
  minWidth: "6.5em",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
};

const userRowStyle = {
  width: "100%",
  paddingBottom: "5px",
  paddingTop: "5px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const flexStyle = {
  display: "flex"
};

const infoBabyStyle = {
  width: "12em",
  marginLeft: "5px",
  marginRight: "5px",
  marginTop: "10px"
};

const User = connect(state => {
  const role = R.view(rolePath, state);
  const team = R.view(teamPath, state);
  const style = R.view(styleForTeamPath(team), state);
  return {
    style,
    role: role,
    username: R.view(usernamePath, state)
  };
})(({ role, username, style }) => (
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
));

export default User;
