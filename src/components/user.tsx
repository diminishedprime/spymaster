import React from "react";
import R from "ramda";
import { largeTextStyle } from "./commonStyles";
import * as actions from "../redux/actions";
import * as lens from "../redux/lenses";

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

const User: React.FC = () => {
  const role = actions.useLensSelector(lens.role);
  const team = actions.useLensSelector(lens.team);
  const style = actions.useLensSelector(lens.teamStyle(team));
  const username = actions.useLensSelector(lens.username);
  return (
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
};

export default User;
