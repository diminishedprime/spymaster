import React from "react";
import * as t from "../../types";
import R from "ramda";
import { connect } from "react-redux";

import { styleForTeamPath, cardsPath } from "../../redux/paths";

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

const mapStateToProps = (state: t.ReduxState): StateProps => {
  const cards: t.Card[] = R.view(cardsPath, state);

  const team1cards: t.Card[] = R.filter(
    ({ team }) => team === t.Team.TEAM_1,
    cards
  );
  const team1Total: number = R.keys(team1cards).length;
  const team1Flipped: number = R.keys(R.filter(R.prop("flipped"), team1cards))
    .length;
  const team1Style: React.CSSProperties = R.view(
    styleForTeamPath(t.Team.TEAM_1),
    state
  );

  const team2cards: t.Card[] = R.filter(
    ({ team }) => team === t.Team.TEAM_2,
    cards
  );
  const team2Total: number = R.keys(team2cards).length;
  const team2Flipped: number = R.keys(R.filter(R.prop("flipped"), team2cards))
    .length;
  const team2Style: React.CSSProperties = R.view(
    styleForTeamPath(t.Team.TEAM_2),
    state
  );

  return {
    team1Flipped,
    team1Total,
    team2Flipped,
    team2Total,
    team1Style,
    team2Style
  };
};

const Teams: React.FC<AllProps> = ({
  team1Flipped,
  team1Total,
  team2Flipped,
  team2Total,
  team1Style,
  team2Style
}) => (
  <div style={scoreStyle}>
    <div style={R.merge(teamStyle, team1Style)}>
      {team1Flipped} / {team1Total}
    </div>
    <div style={R.merge(teamStyle, team2Style)}>
      {team2Flipped} / {team2Total}
    </div>
  </div>
);

export default connect(mapStateToProps)(Teams);
