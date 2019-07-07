import React from "react";
import * as r from "../redux";
import * as t from "../types";
import * as a from "../redux/actions";
import * as cl from "../common-logic";

const JoinRole: React.FC = () => {
  const dispatch = r.useDispatch();
  const gameId = r.useSelector(r.lens.gameId.get);
  const game = r.useSelector(r.lens.game.get);
  const playerId = r.useSelector(r.lens.playerId.get);
  const team = r.useSelector(r.lens.team(playerId).get);
  const role = r.useSelector(r.lens.role(playerId).get);

  const requestRole = React.useCallback(
    (role: t.Role) => {
      if (gameId.isSome()) {
        dispatch(a.requestRole(gameId.value, role));
      } else {
        console.error("This invariant should not happen.");
      }
    },
    [dispatch, gameId]
  );

  const roleDisabled = React.useCallback(
    (r: t.Role) => {
      if (game.isSome() && team.isSome()) {
        return (
          !cl.canHaveRole(team.value, r, game.value) ||
          (role.isSome() && role.value === r)
        );
      }
      return false;
    },
    [game, team, role]
  );

  return team.isSome() ? (
    <div>
      <button
        disabled={roleDisabled(t.Role.Spymaster)}
        onClick={() => requestRole(t.Role.Spymaster)}
      >
        Spymaster
      </button>
      <button
        disabled={role.isSome() && role.value === t.Role.Guesser}
        onClick={() => requestRole(t.Role.Guesser)}
      >
        Guesser
      </button>
    </div>
  ) : null;
};

const JoinTeam: React.FC = () => {
  const dispatch = r.useDispatch();
  const gameId = r.useSelector(r.lens.gameId.get);
  const playerId = r.useSelector(r.lens.playerId.get);
  const team = r.useSelector(r.lens.team(playerId).get);

  const joinTeam = React.useCallback(
    (team: t.Team.Team1 | t.Team.Team2) => {
      if (gameId.isSome()) {
        dispatch(a.requestTeam(gameId.value, team));
      } else {
        console.error("This invariant should not happen");
      }
    },
    [gameId, dispatch]
  );

  return (
    <div>
      <button
        disabled={team.isSome() && team.value === t.Team.Team1}
        onClick={() => joinTeam(t.Team.Team1)}
      >
        Team 1
      </button>
      <button
        disabled={team.isSome() && team.value === t.Team.Team2}
        onClick={() => joinTeam(t.Team.Team2)}
      >
        Team 2
      </button>
    </div>
  );
};

const StartGame: React.FC = () => {
  const hasNecessaryPlayers = r.useSelector(r.lens.hasNecessaryPlayers.get);

  // TODO - actually send an event to start the game.

  return (
    <div>
      {hasNecessaryPlayers.isSome() && hasNecessaryPlayers.value ? (
        <button>Start Game</button>
      ) : (
        <div>Waiting for players to join remaining roles.</div>
      )}
    </div>
  );
};

const Game: React.FC = () => {
  const inGame = r.useSelector(r.lens.inGame.get);
  return inGame ? (
    <div>
      <JoinTeam />
      <JoinRole />
      <StartGame />
    </div>
  ) : null;
};

export default Game;
