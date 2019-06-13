import React from "react";
import R from "ramda";
import { connect } from "react-redux";
import * as t from "./../types";

import { clientUsersPath } from "./../redux/paths";

const connectedUsersStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center"
};

const usersStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center"
};

interface StateProps {
  users: t.UserId[];
}

type AllProps = StateProps;

const mapStateToProps = (state: t.ReduxState): StateProps => {
  const users = R.keys(R.view(clientUsersPath, state));
  return {
    users
  };
};
const ConnectedUsers: React.FC<AllProps> = ({ users }) => {
  return (
    <div style={connectedUsersStyle}>
      <h3>Connected Users</h3>
      <div style={usersStyle}>
        {users.map(userId => {
          return <div key={userId}>{userId}</div>;
        })}
      </div>
    </div>
  );
};

export default connect(mapStateToProps)(ConnectedUsers);
