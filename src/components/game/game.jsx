import React from "react";
import R from "ramda";
import { connect } from "react-redux";

import Board from "../card/board";
import Info from "../info/info";
import Timer from "../timer/timer";
import { cardsPath } from "../../redux/paths";

const mapStateToProps = state => ({
  cardIds: R.keys(R.view(cardsPath, state))
});

const Game = ({ cardIds }) => (
  <div>
    <Timer />
    <Board cardIds={cardIds} />
    <Timer />
    <Info />
  </div>
);

export default connect(mapStateToProps)(Game);
