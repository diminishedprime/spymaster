import React from "react";
import Board from "./board";
import Info from "./info";
import Timer from "./timer";
import * as lens from "../redux/lenses";
import * as actions from "../redux/actions";

const Game: React.FC = () => {
  const cards = actions.useLens(lens.cards);
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
