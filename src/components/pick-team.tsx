import React from "react";
import * as t from "./../types";
import R from "ramda";
import { CirclePicker } from "react-color";
import { AGENT, SPYMASTER } from "./../constants";
import * as actions from "./../redux/actions";
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

interface TeamRowProps {
  team: t.Team;
}

const TeamRow: React.FC<TeamRowProps> = ({ team }) => {
  const { setBackgroundColor, pickRole } = actions.useApi();

  const backgroundColor = actions.useSelector<string>(state =>
    R.view(backgroundColorForTeamPath(team), state)
  );

  const style = actions.useSelector<React.CSSProperties>(state =>
    R.view(styleForTeamPath(team), state)
  );

  return (
    <div style={teamRowStyle}>
      <div>
        <StyledButton
          text={SPYMASTER}
          style={R.merge(style, teamButtonsStyle)}
          onClick={() => pickRole(team, t.Role.SPYMASTER)}
        />
        <StyledButton
          text={AGENT}
          style={R.merge(style, teamButtonsStyle)}
          onClick={() => pickRole(team, t.Role.AGENT)}
        />
      </div>
      <CirclePicker
        onChangeComplete={({ hex }) => setBackgroundColor(team, hex)}
        color={backgroundColor}
      />
    </div>
  );
};

const PickTeam = () => (
  <div style={pickTeamStyle}>
    <TeamRow team={t.Team.TEAM_1} />
    <TeamRow team={t.Team.TEAM_2} />
  </div>
);

export default PickTeam;
