import React from "react";
import * as actions from "../redux/actions";
import * as lens from "../redux/lenses";

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

const ConnectedUsers: React.FC = () => {
  const users = actions.useLens(lens.clientUsers);
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

export default ConnectedUsers;
