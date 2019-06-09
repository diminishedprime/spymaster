import React from "react";
import * as t from "./../types";
import R from "ramda";
import { connect } from "react-redux";
import { CirclePicker } from "react-color";

import { AGENT, SPYMASTER } from "./../constants";
import { afChangeBackgroundColor, afPickRole } from "./../redux/actions";
import { styleForTeamPath, backgroundColorForTeamPath } from "./../redux/paths";

const teamRowStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const teamButtonsStyle: React.CSSProperties = {
  margin: "5px",
  minWidth: "100px"
};

const pickTeamStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  flexDirection: "column"
};

interface StyledButtonProps {
  style: React.CSSProperties;
  text: string;
  onClick: () => void;
}

const StyledButton: React.FC<StyledButtonProps> = ({
  style,
  text,
  onClick
}) => (
  <button onClick={onClick} style={style}>
    {text}
  </button>
);

interface OwnProps {
  team: t.Team;
}

interface StateProps {
  style: React.CSSProperties;
  backgroundColor: string;
}

interface DispatchProps {
  onColorChange: ({ hex }: { hex: string }) => void;
  pickRole: (role: t.Role) => () => void;
}

type AllProps = DispatchProps & StateProps & OwnProps;

const mapStateToProps = (
  state: t.ReduxState,
  { team }: OwnProps
): StateProps => ({
  style: R.view(styleForTeamPath(team), state),
  backgroundColor: R.view(backgroundColorForTeamPath(team), state)
});

const mapDispatchToProps = (
  dispatch: t.Dispatch,
  { team }: OwnProps
): DispatchProps => ({
  onColorChange: ({ hex }) => dispatch(afChangeBackgroundColor(team, hex)),
  pickRole: role => () => dispatch(afPickRole(team, role))
});

const TeamRow: React.FC<AllProps> = ({
  onColorChange,
  style,
  pickRole,
  backgroundColor
}) => (
  <div style={teamRowStyle}>
    <div>
      <StyledButton
        text={SPYMASTER}
        style={R.merge(style, teamButtonsStyle)}
        onClick={pickRole(t.Role.SPYMASTER)}
      />
      <StyledButton
        text={AGENT}
        style={R.merge(style, teamButtonsStyle)}
        onClick={pickRole(t.Role.AGENT)}
      />
    </div>
    <CirclePicker onChangeComplete={onColorChange} color={backgroundColor} />
  </div>
);

const ConnectedTeamRow = connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamRow);

const PickTeam = () => (
  <div style={pickTeamStyle}>
    <ConnectedTeamRow team={t.Team.TEAM_1} />
    <ConnectedTeamRow team={t.Team.TEAM_2} />
  </div>
);

export default PickTeam;
