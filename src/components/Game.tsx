import React from "react";
import * as r from "../redux";
import * as t from "../types";
import * as a from "../redux/actions";

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

  return team.isSome() ? (
    <div>
      <button
        disabled={team.value === t.Team.Team1}
        onClick={() => joinTeam(t.Team.Team1)}
      >
        Team 1
      </button>
      <button
        disabled={team.value === t.Team.Team2}
        onClick={() => joinTeam(t.Team.Team2)}
      >
        Team 2
      </button>
    </div>
  ) : null;
};

const Game: React.FC = () => {
  const inGame = r.useSelector(r.lens.inGame.get);
  return inGame ? (
    <div>
      <JoinTeam />
    </div>
  ) : null;
};

export default Game;
