import React from "react";
import * as actions from "../redux/actions";

const NewGame = () => {
  const newGame = actions.useApi().newGame;
  return <button onClick={newGame}>New Game</button>;
};

export default NewGame;
