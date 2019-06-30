import React from "react";
import * as r from "../redux";
import * as a from "../redux/actions";
import * as t from "../types";
/* import React from "react";
 * import * as t from "./../types";
 * import * as actions from "../redux/actions";
 * import * as lens from "../redux/lenses";
 *
 * import PickUsername from "./pick-username";
 * import NewGame from "./new-game";
 * import ConnectedUsers from "./connected-users";
 *
 * interface JoinGameProps {
 *   gameId: t.GameId;
 *   userId: t.UserId;
 * }
 *
 * const JoinGame: React.FC<JoinGameProps> = ({ gameId, userId }) => {
 *   const { joinGame } = actions.useApi();
 *   return (
 *     <button
 *       onClick={() => {
 *         return joinGame(gameId, userId);
 *       }}
 *     >
 *       {gameId.substring(0, 8)}
 *     </button>
 *   );
 * };
 *
 * const Lobby: React.FC = () => {
 *   const gameIds = actions.useLens(lens.gameIds);
 *   console.log({ gameIds });
 *   const userId = actions.useLens(lens.userId);
 *   return (
 *     <div>
 *       <NewGame />
 *       <div>
 *         Join Existing Game
 *         <div>
 *           {gameIds.map(gameId => {
 *             return <JoinGame key={gameId} gameId={gameId} userId={userId} />;
 *           })}
 *         </div>
 *       </div>
 *       <PickUsername />
 *       <ConnectedUsers />
 *     </div>
 *   );
 * }; */

interface JoinGameProps {
  gameId: t.GameId;
}

const JoinGame: React.FC<JoinGameProps> = ({ gameId }) => {
  const dispatch = r.useDispatch();

  const join = React.useCallback(() => dispatch(a.joinGame(gameId)), [gameId]);

  return <button onClick={join}>{gameId}</button>;
};

const Lobby: React.FC = () => {
  const inLobby = r.useSelector(r.lens.inLobby.get);
  const gameIds = r.useSelector(r.lens.gameIds.get);
  const dispatch = r.useDispatch();
  return inLobby ? (
    <div>
      <button onClick={() => dispatch(a.newGame())}>New Game</button>
      <h1>Game Ids:</h1>
      {gameIds.map(gameId => (
        <JoinGame key={gameId} gameId={gameId} />
      ))}
    </div>
  ) : null;
};

export default Lobby;
