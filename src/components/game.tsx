import React from "react";
import Board from "./board";
import Info from "./info";
import Timer from "./timer";
import * as actions from "../redux/actions";
import * as t from "../types";

const Game: React.FC = () => {
  const cards = actions
    .useOptionLens(t.lens.reduxState.remoteState.cards)
    .getOrElse({});
  const cardIds = Object.keys(cards);
  return (
    <div>
      <Timer />
      <Board cardIds={cardIds} />
      <Timer />
      <Info />
    </div>
  );
};

export default Game;
