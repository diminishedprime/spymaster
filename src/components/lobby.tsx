import React from "react";
import * as t from "./../types";
import * as actions from "../redux/actions";
import R from "ramda";

import PickUsername from "./pick-username";
import NewGame from "./new-game";
import ConnectedUsers from "./connected-users";
import { gameIdsPath, userIdPath } from "./../redux/paths";

interface JoinGameProps {
  gameId: t.GameId;
  userId: t.UserId;
}

const JoinGame: React.FC<JoinGameProps> = ({ gameId, userId }) => {
  const joinGame = actions.useApi().joinGame;
  return (
    <button onClick={() => joinGame(gameId, userId)}>
      {gameId.substring(0, 8)}
    </button>
  );
};

const Lobby: React.FC = () => {
  const gameIds = actions.useSelector<t.GameId[]>(state =>
    R.view(gameIdsPath, state)
  );
  const userId = actions.useSelector<t.UserId>(state =>
    R.view(userIdPath, state)
  );
  return (
    <div>
      <NewGame />
      <div>
        Join Existing Game
        <div>
          {R.map(
            gameId => (
              <JoinGame key={gameId} gameId={gameId} userId={userId} />
            ),
            gameIds
          )}
        </div>
      </div>
      <PickUsername />
      <ConnectedUsers />
    </div>
  );
};

export default Lobby;
