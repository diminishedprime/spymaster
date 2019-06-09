import React from "react";
import * as t from "./../types";
import R from "ramda";
import { connect } from "react-redux";

import { winnerPath } from "./../redux/paths";

import NewGame from "./new-game";

interface StateProps {
  winner: t.Team;
}

type AllProps = StateProps;

const mapStateToProps = (state: t.ReduxState): StateProps => ({
  winner: R.view(winnerPath, state)
});

const Win: React.FC<AllProps> = ({ winner }) => (
  <div>
    <div>The winner was {winner}</div>
    <NewGame />
  </div>
);

export default connect(mapStateToProps)(Win);
