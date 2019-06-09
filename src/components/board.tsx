import React from "react";
import R from "ramda";
import * as t from "./../types";

import CardRow from "./card-row";

const boardStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  flexDirection: "column"
};

interface BoardProps {
  cardIds: t.CardId[];
}

const Board: React.FC<BoardProps> = ({ cardIds }) => (
  <div style={boardStyle}>
    {R.splitEvery(5, cardIds).map(cardIds => (
      <CardRow key={cardIds.join("-")} cardIds={cardIds} />
    ))}
  </div>
);

export default Board;
