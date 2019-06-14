import React from "react";
import * as t from "./../types";
import R from "ramda";
import * as actions from "../redux/actions";
import * as lens from "../redux/lenses";

const scoreStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  alignItems: "center",
  marginLeft: "10px",
  marginRight: "10px"
};

const teamStyle: React.CSSProperties = {
  width: "100px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexGrow: 1
};

interface StateProps {
  team1Flipped: number;
  team1Total: number;
  team2Flipped: number;
  team2Total: number;
  team1Style: React.CSSProperties;
  team2Style: React.CSSProperties;
}

type AllProps = StateProps;

const Teams: React.FC<AllProps> = () => {
  const cards = actions.useLens(lens.cards);
  const team1Cards = R.filter(c => c.team === t.Team.TEAM_1, cards);
  const team1Total = Object.keys(team1Cards).length;
  const team1Flipped = Object.keys(R.filter(a => a.flipped, team1Cards)).length;
  const team1Style = actions.useLens(lens.teamStyle(t.Team.TEAM_1));

  const team2Cards = R.filter(c => c.team === t.Team.TEAM_2, cards);
  const team2Total = Object.keys(team2Cards).length;
  const team2Flipped = Object.keys(R.filter(a => a.flipped, team2Cards)).length;
  const team2Style = actions.useLens(lens.teamStyle(t.Team.TEAM_2));

  return (
    <div style={scoreStyle}>
      <div style={R.merge(teamStyle, team1Style)}>
        {team1Flipped} / {team1Total}
      </div>
      <div style={R.merge(teamStyle, team2Style)}>
        {team2Flipped} / {team2Total}
      </div>
    </div>
  );
};

export default Teams;
