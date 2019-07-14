import React from "react";
import * as r from "../redux";
import * as t from "../types";
import * as a from "../redux/actions";
import * as cl from "../common-logic";
import styled from "styled-components";

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
  const gameId = r.useSelector(r.lens.gameId.get);
  const dispatch = r.useDispatch();

  const startGame = React.useCallback(() => {
    gameId.isSome() && dispatch(a.startGame(gameId.value));
  }, [dispatch, gameId]);

  return (
    <div>
      {hasNecessaryPlayers.isSome() && hasNecessaryPlayers.value ? (
        <button onClick={startGame}>Start Game</button>
      ) : (
        <div>Waiting for players to join remaining roles.</div>
      )}
    </div>
  );
};

const GameSetUp: React.FC = () => {
  const started = r.useSelector(r.lens.started.get);
  return started.isSome() && !started.value ? (
    <div>
      <JoinTeam />
      <JoinRole />
      <StartGame />
    </div>
  ) : null;
};

const cardBackground = (card: t.Card): string => {
  switch (card.team) {
    case t.Team.Team1:
      return "blue";
    case t.Team.Team2:
      return "red";
    case t.Team.Assassin:
      return "orange";
    case t.Team.Bystander:
      return "gray";
  }
};

// TODO - Make background-color only show when flipped or current player is a
// spymaster.
const Card = styled.div`
  border: 1px solid black;
  background-color: ${(props: t.Card) => cardBackground(props)};
`;

const BoardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 19vw);
  grid-template-rows: repeat(5, 10vh);
`;

const Board: React.FC = () => {
  const cards = r.useSelector(s =>
    r.lens.cards.get(s).map(c => c.valueSeq().toArray())
  );
  return cards.isSome() ? (
    <BoardWrapper>
      {cards.value.map(card => {
        return <Card {...card}>{card.text}</Card>;
      })}
    </BoardWrapper>
  ) : null;
};

const SpymasterControls: React.FC = () => {
  const playerId = r.useSelector(r.lens.playerId.get);
  const isSpymaster = r.useSelector(r.lens.isSpymaster(playerId).get);
  return isSpymaster.isSome() && isSpymaster.value ? (
    <div>
      <input placeholder="Hint" />
    </div>
  ) : null;
};

const Guesser: React.FC = () => {
  const playerId = r.useSelector(r.lens.playerId.get);
  const isGuesser = r.useSelector(r.lens.isGuesser(playerId).get);
  return isGuesser.isSome() && isGuesser.value ? (
    <div>
      <div>This is where the guess hint goes.</div>
    </div>
  ) : null;
};

const Game: React.FC = () => {
  const inGame = r.useSelector(r.lens.inGame.get);
  return inGame ? (
    <div>
      <GameSetUp />
      <Board />
      <SpymasterControls />
      <Guesser />
    </div>
  ) : null;
};

export default Game;
