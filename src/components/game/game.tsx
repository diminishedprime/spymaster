import React from "react";
import * as t from "../../types";
import R from "ramda";
import { connect } from "react-redux";

import Board from "../card/board";
import Info from "../info/info";
import Timer from "../timer/timer";
import { cardsPath } from "../../redux/paths";

interface StateProps {
  cardIds: t.CardId[];
}

type AllProps = StateProps;

const mapStateToProps = (state: t.ReduxState): StateProps => {
  const cardIds = R.keys(R.view(cardsPath, state));
  return {
    cardIds
  };
};

const Game: React.FC<AllProps> = ({ cardIds }) => (
  <div>
    <Timer />
    <Board cardIds={cardIds} />
    <Timer />
    <Info />
  </div>
);

export default connect(mapStateToProps)(Game);
