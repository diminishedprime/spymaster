import React from "react";
import * as actions from "../redux/actions";
import * as lens from "../redux/lenses";
import NewGame from "./new-game";

const Win: React.FC = () => {
  const winner = actions.useLens(lens.winner);
  return (
    <div>
      <div>The winner was {winner}</div>
      <NewGame />
    </div>
  );
};

export default Win;
