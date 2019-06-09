import React from "react";
import * as t from "../../types";
import R from "ramda";
import { connect } from "react-redux";

import {
  afSetEditing,
  afSetUsername,
  afSetServerUsername
} from "../../redux/actions";
import { usernamePath, editingPath } from "../../redux/paths";

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

interface StateProps {
  username: string;
  editing: boolean;
}

interface DispatchProps {
  setEditing: () => void;
  changeUsername: (username: string) => void;
  onChange: ({ target: { value } }: { target: { value: string } }) => void;
  updateUsername: () => void;
  // TODO - fix this to actual type
  onKeyPress: ({ key }: React.KeyboardEvent<any>) => void;
  // TODO - fix this to actual type
  onFocus: (e: any) => void;
}

type AllProps = DispatchProps & StateProps;

const mapStateToProps = (state: t.ReduxState): StateProps => ({
  username: R.view(usernamePath, state),
  editing: R.view(editingPath, state)
});

const mapDispatchToProps = (dispatch: t.Dispatch): DispatchProps => {
  const setEditing = () => dispatch(afSetEditing());
  const changeUsername = (username: string) =>
    dispatch(afSetUsername(username));
  const updateUsername = () => dispatch(afSetServerUsername());

  return {
    setEditing,
    changeUsername,
    updateUsername,
    onKeyPress: ({ key }) => (key === "Enter" ? updateUsername() : null),
    onChange: ({ target: { value } }) => changeUsername(value),
    onFocus: event => event.target.select()
  };
};

const EditUsername = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ username, onChange, onKeyPress, updateUsername, onFocus }) => (
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
));

const ShowUsername = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ setEditing, username }) => <div onClick={setEditing}>{username}</div>);

const Username = connect(mapStateToProps)(({ editing }) => (
  <div>{editing ? <EditUsername /> : <ShowUsername />}</div>
));

const PickUsername = () => (
  <div style={pickUsernameStyle}>
    <div>Your Name</div>
    <Username />
  </div>
);

export default PickUsername;
