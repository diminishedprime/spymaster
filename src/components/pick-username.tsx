import React from "react";
import * as actions from "../redux/actions";

const pickUsernameStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const usernameInputStyle: React.CSSProperties = {
  minWidth: "200px",
  textAlign: "center"
};

const editUsernameStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const usernameButtonStyle: React.CSSProperties = {
  width: "5em"
};

const Username = () => {
  const { changeUsername } = actions.useApi();
  const [editing, setEditing] = React.useState(false);
  const [username, setUsername] = React.useState("abcd");

  // TODO - We want to add an effect that if the remote state username changes, we update the local one as well.

  const onChange = React.useCallback(({ target: { value } }) => {
    console.log({ value });
    setUsername(value);
  }, []);

  const updateUsername = React.useCallback(() => {
    setEditing(false);
    changeUsername(username);
  }, [username, changeUsername]);

  const onFocus = React.useCallback(event => {
    event.target.select();
  }, []);

  const onKeyPress = React.useCallback(
    ({ key }) => {
      if (key === "Enter") {
        updateUsername();
      }
    },
    [updateUsername]
  );

  const editUsername = React.useMemo(() => {
    return (
      <div style={editUsernameStyle}>
        <input
          style={usernameInputStyle}
          value={username}
          onChange={onChange}
          onKeyPress={onKeyPress}
          onFocus={onFocus}
        />
        <button style={usernameButtonStyle} onClick={updateUsername}>
          update
        </button>
      </div>
    );
  }, [username, onChange, onFocus, onKeyPress, updateUsername]);
  const showUsername = React.useMemo(() => {
    return <div onClick={() => setEditing(true)}>{username}</div>;
  }, [username]);
  return <div>{editing ? editUsername : showUsername}</div>;
};

const PickUsername = () => (
  <div style={pickUsernameStyle}>
    <div>Your Name</div>
    <Username />
  </div>
);

export default PickUsername;
