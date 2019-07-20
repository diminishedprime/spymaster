import * as m from "monocle-ts";
import * as t from "../types";

const serverReduxStateLens = m.Lens.fromProp<t.ServerReduxState>();

export const lens = (() => {
  const server = serverReduxStateLens("server");
  const games = serverReduxStateLens("games");
  const users = serverReduxStateLens("users");

  const game = (id: t.GameId) => {
    const getter = (games: t.Games) => t.fromNullable(games.get(id));
    const setter = (game: t.Option<t.Game>) => (games: t.Games) =>
      game.isSome() ? games.set(game.value.id, game.value) : games;
    return games.compose(new m.Lens<t.Games, t.Option<t.Game>>(getter, setter));
  };

  const user = (userId: t.UserId) => {
    const getter = (users: t.Users) => t.fromNullable(users.get(userId));
    const setter = (user: t.Option<t.User>) => (users: t.Users) =>
      user.isSome() ? users.set(user.value.id, user.value) : users;
    return users.compose(new m.Lens<t.Users, t.Option<t.User>>(getter, setter));
  };

  const players = (gameId: t.GameId) => {
    // const sub = m.Lens.fromProp<t.Game>()("players")
    // const getter = ()
    const getter = (game: t.Option<t.Game>) => game.map(game => game.players);
    const setter = (players: t.Option<t.Players>) => (game: t.Option<t.Game>) =>
      game.map(game =>
        players.isSome()
          ? {
              ...game,
              players: players.value
            }
          : game
      );
    const base = game(gameId);
    return base.compose(
      new m.Lens<t.Option<t.Game>, t.Option<t.Players>>(getter, setter)
    );
  };

  const gamePlayers = (playerId: t.PlayerId) => {
    const getter = (game: t.Game) => t.fromNullable(game.players.get(playerId));
    const setter = (player: t.Option<t.Player>) => (game: t.Game) => {
      const players = player.isSome()
        ? game.players.set(playerId, player.value)
        : game.players;
      return { ...game, players };
    };
    return new m.Lens<t.Game, t.Option<t.Player>>(getter, setter);
  };

  const player = (gameId: t.GameId, playerId: t.PlayerId) => {
    const getter = (players: t.Option<t.Players>) => {
      return players.chain(players => t.fromNullable(players.get(playerId)));
    };
    const setter = (player: t.Option<t.Player>) => (
      players: t.Option<t.Players>
    ) =>
      players.map(players =>
        player.isSome() ? players.set(playerId, player.value) : players
      );
    const base = players(gameId);
    return base.compose(
      new m.Lens<t.Option<t.Players>, t.Option<t.Player>>(getter, setter)
    );
  };

  return {
    gamePlayers,
    server,
    games,
    game,
    users,
    user,
    players,
    player
  };
})();
