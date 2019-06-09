import React from "react";

import Hint from "../hint/hint";

import Teams from "./teams";
import User from "./user";

const infoStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap"
};

const Info = () => (
  <div style={infoStyle}>
    <Hint />
    <Teams />
    <User />
  </div>
);

export default Info;
