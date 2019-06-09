import React from "react";
import R from "ramda";
import { connect } from "react-redux";

import { TEAM_1, TEAM_2 } from "../../constants";
import { styleForTeamPath, cardsPath } from "../../redux/paths";

const scoreStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  alignItems: "center",
  marginLeft: "10px",
  marginRight: "10px"
};

const teamStyle = {
  width: "100px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexGrow: "1"
};

const Teams = connect(state => {
  const cards = R.view(cardsPath, state);

  const team1cards = R.filter(({ team }) => team === TEAM_1, cards);
  const team1Total = R.keys(team1cards).length;
  const team1Flipped = R.keys(R.filter(R.prop("flipped"), team1cards)).length;
  const team1Style = R.view(styleForTeamPath(TEAM_1), state);

  const team2cards = R.filter(({ team }) => team === TEAM_2, cards);
  const team2Total = R.keys(team2cards).length;
  const team2Flipped = R.keys(R.filter(R.prop("flipped"), team2cards)).length;
  const team2Style = R.view(styleForTeamPath(TEAM_2), state);

  return {
    team1Flipped,
    team1Total,
    team2Flipped,
    team2Total,

    team1Style,
    team2Style
  };
})(
  ({
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
  )
);

export default Teams;
