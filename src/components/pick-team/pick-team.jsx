import React from "react";
import R from "ramda";
import { connect } from "react-redux";
import { CirclePicker } from "react-color";

import { AGENT, SPYMASTER } from "../../constants";
import { afChangeBackgroundColor, afPickRole } from "../../redux/actions";
import {
  styleForTeamPath,
  backgroundColorForTeamPath
} from "../../redux/paths";

const teamRowStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const teamButtonsStyle = {
  margin: "5px",
  minWidth: "100px"
};

const pickTeamStyle = {
  display: "flex",
  alignItems: "center",
  flexDirection: "column"
};

const StyledButton = ({ style, text, onClick }) => (
  <button onClick={onClick} style={style}>
    {text}
  </button>
);

const TeamRow = connect(
  (state, { team }) => ({
    style: R.view(styleForTeamPath(team), state),
    backgroundColor: R.view(backgroundColorForTeamPath(team), state)
  }),
  (dispatch, { team }) => ({
    onColorChange: ({ hex }) => dispatch(afChangeBackgroundColor(team, hex)),
    pickRole: role => () => dispatch(afPickRole(team, role))
  })
)(({ onColorChange, style, pickRole, backgroundColor }) => (
  <div style={teamRowStyle}>
    <div>
      <StyledButton
        text={SPYMASTER}
        style={R.merge(style, teamButtonsStyle)}
        onClick={pickRole(SPYMASTER)}
      />
      <StyledButton
        text={AGENT}
        style={R.merge(style, teamButtonsStyle)}
        onClick={pickRole(AGENT)}
      />
    </div>
    <CirclePicker onChangeComplete={onColorChange} color={backgroundColor} />
  </div>
));

const PickTeam = () => (
  <div style={pickTeamStyle}>
    <TeamRow team="1" />
    <TeamRow team="2" />
  </div>
);

export default PickTeam;
