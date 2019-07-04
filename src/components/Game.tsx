import React from "react";
import * as r from "../redux";

const Game: React.FC = () => {
  const inGame = r.useSelector(r.lens.inGame.get);
  return inGame ? <div>Joined the game</div> : null;
};

export default Game;
