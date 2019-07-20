import createSagaMiddleware from "redux-saga";
import * as cl from "../../../src/common-logic";
import transit from "../../../src/transit";
import shuffle from "shuffle-array";
import io from "socket.io";
import uuid4 from "uuid/v4";
import * as i from "immutable";
import * as ro from "redux-observable";
import * as t from "../types";
import * as redux from "redux";
import { filter, flatMap, map } from "rxjs/operators";
import { fromEventPattern } from "rxjs";
import * as ta from "typesafe-actions";
import * as m from "monocle-ts";
import * as a from "./actions";
import * as ca from "../../../src/redux/actions";
import words from "../words";

declare module "typesafe-actions" {
  interface Types {
    RootAction: t.RootAction;
  }
}

const initialState: t.ServerReduxState = {
  games: i.Map(),
  users: i.Map(),
  server: t.none
};

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

const newGame = (id: t.GameId): t.Game => ({
  id,
  players: i.Map(),
  hasNecessaryPlayers: false,
  cards: t.none,
  started: false,
  currentTeam: t.none,
  hint: t.none
});

const gameReducer = ta
  .createReducer(newGame("0"))
  .handleAction(a.setHint, (game, { payload }) => ({
    ...game,
    hint: t.some(payload.hint)
  }))
  .handleAction(a.setCurrentTeam, (game, { payload }) => ({
    ...game,
    currentTeam: t.some(payload.team)
  }))
  .handleAction(a.setStarted, (game, { payload }) => ({
    ...game,
    started: payload.started
  }))
  .handleAction(a.setCards, (game, { payload }) => ({
    ...game,
    cards: t.some(payload.cards)
  }))
  .handleAction(a.setRole, (game, { payload }) =>
    lens
      .gamePlayers(payload.userId)
      .modify(p => p.map(p => ({ ...p, role: t.some(payload.role) })))(game)
  )
  .handleAction(a.setIsReady, (game, { payload }) => ({
    ...game,
    hasNecessaryPlayers: cl.readyToStart(game)
  }))
  .handleAction(a.setTeam, (game, { payload }) =>
    lens
      .gamePlayers(payload.playerId)
      .modify(p =>
        p.map(p => ({ ...p, team: t.some(payload.team), role: t.none }))
      )(game)
  )
  .handleAction(a.playerJoinGame, (game, { payload }) =>
    lens.gamePlayers(payload.playerId).set(
      t.some({
        id: payload.playerId,
        alias: t.none,
        team: t.none,
        role: t.none
      })
    )(game)
  );

const app = ta
  .createReducer(initialState)
  .handleAction(a.newGame, (state, { payload }) =>
    lens.game(payload.id).set(t.some(newGame(payload.id)))(state)
  )
  .handleAction(
    [
      a.setHint,
      a.setCurrentTeam,
      a.setStarted,
      a.setCards,
      a.setRole,
      a.setIsReady,
      a.setTeam,
      a.playerJoinGame
    ],
    (state, action) =>
      lens
        .game(action.payload.gameId)
        .modify(g => g.map(g => gameReducer(g, action)))(state)
  )
  .handleAction(a.removeUser, (state, { payload }) => {
    const withRemoved = lens.users.modify(users => users.remove(payload.id))(
      state
    );
    // TODO - This might should be refactored out into being called from a
    // separate 'remove from game' action.
    return lens.games.modify(games =>
      games.update(games =>
        games.map(game => ({
          ...game,
          players: game.players.remove(payload.id)
        }))
      )
    )(withRemoved);
  })
  .handleAction(a.addUser, (state, { payload }) =>
    lens.user(payload.id).set(t.some(payload))(state)
  )
  .handleAction(a.connectWebsocket, (state, { payload }) =>
    lens.server.set(t.some(payload.httpServer))(state)
  );

const fromClient = (state$: ro.StateObservable<t.ServerReduxState>) => (
  action: ta.ActionType<typeof a.fromClient>
): t.RootAction[] => {
  const actions: t.RootAction[] = [];
  const clientAction = action.payload.clientAction;
  const userId = action.payload.clientId;
  if (ta.isActionOf(ca.setHint)(clientAction)) {
    actions.push(
      a.setHint(clientAction.payload.gameId, clientAction.payload.hint)
    );
  }
  if (ta.isActionOf(ca.joinGame)(clientAction)) {
    actions.push(a.playerJoinGame(clientAction.payload.gameId, userId));
    actions.push(a.refreshGameState(clientAction.payload.gameId));
    actions.push(a.sendAction(userId, ca.setPage(t.Page.Game)));
  }
  if (ta.isActionOf(ca.requestRole)(clientAction)) {
    const gameId = clientAction.payload.gameId;
    const requestedRole = clientAction.payload.role;
    const team = lens
      .player(gameId, userId)
      .get(state$.value)
      .chain(p => p.team);
    const game = lens.game(gameId).get(state$.value);
    if (
      team.isSome() &&
      game.isSome() &&
      cl.canHaveRole(team.value, requestedRole, game.value)
    ) {
      actions.push(a.setRole(gameId, userId, requestedRole));
      actions.push(a.setIsReady(gameId));
      actions.push(a.refreshGameState(gameId));
    } else {
      // TODO - send a message that that role is no-longer available? This might
      // not be necessary since after the other one is successful, we'll disable
      // it client-side.
    }
  }
  if (ta.isActionOf(ca.requestTeam)(clientAction)) {
    const gameId = clientAction.payload.gameId;
    const requestedTeam = clientAction.payload.team;
    const game = lens.game(clientAction.payload.gameId).get(state$.value);
    if (game.isSome()) {
      actions.push(a.setTeam(gameId, userId, requestedTeam));
      actions.push(a.refreshGameState(game.value.id));
    } else {
      // TODO - this could have better error handling later.
    }
  }
  if (ta.isActionOf(ca.newGame)(clientAction)) {
    actions.push(a.newGame(uuid4()));
  }
  if (ta.isActionOf(ca.startGame)(clientAction)) {
    const game = lens.game(clientAction.payload.gameId).get(state$.value);
    if (game.isSome() && !game.value.started) {
      const cards = generateCards();
      const firstTeam = Math.random() > 0.5 ? t.Team.Team1 : t.Team.Team2;
      const gameId = clientAction.payload.gameId;
      actions.push(a.setCurrentTeam(gameId, firstTeam));
      actions.push(a.setCards(gameId, cards));
      actions.push(a.setStarted(gameId, true));
      actions.push(a.refreshGameState(gameId));
    }
  }
  return actions;
};

export const generateCards = (firstTeamOverride?: t.PlayerTeam): t.Cards => {
  const shuffled = shuffle(words);
  const firstTeam =
    firstTeamOverride === undefined
      ? Math.random() > 0.5
        ? t.Team.Team1
        : t.Team.Team2
      : firstTeamOverride;
  const secondTeam = firstTeam === t.Team.Team1 ? t.Team.Team2 : t.Team.Team1;
  const firstTeamCardNumber = 9;
  const secondTeamCardNumber = 8;
  const bystanderCardNumber = 7;
  const assassinCardNumber = 1;
  const firstTeamWords = shuffled.slice(0, firstTeamCardNumber);
  const secondTeamWords = shuffled.slice(
    firstTeamCardNumber,
    firstTeamCardNumber + secondTeamCardNumber
  );
  const bystanderWords = shuffled.slice(
    firstTeamCardNumber + secondTeamCardNumber,
    firstTeamCardNumber + secondTeamCardNumber + bystanderCardNumber
  );
  const assassinWords = shuffled.slice(
    firstTeamCardNumber + secondTeamCardNumber + bystanderCardNumber,
    firstTeamCardNumber +
      secondTeamCardNumber +
      bystanderCardNumber +
      assassinCardNumber
  );

  const cards: t.Cards = i.Map();
  const groups: [t.Team, string[]][] = [
    [firstTeam, firstTeamWords],
    [secondTeam, secondTeamWords],
    [t.Team.Bystander, bystanderWords],
    [t.Team.Assassin, assassinWords]
  ];
  const cardsList = groups.reduce(
    (acc: i.List<t.Card>, [team, teamWords]) =>
      teamWords.reduce(
        (acc: i.List<t.Card>, word) =>
          acc.push({ id: word, text: word, flipped: false, team }),
        acc
      ),
    i.List()
  );
  return shuffle(cardsList.toArray()).reduce(
    (acc: t.Cards, card: t.Card) => acc.set(card.id, card),
    cards
  );
};

const fromClientEpic: t.Epic = (action$, state$) =>
  action$.pipe(
    filter(ta.isActionOf(a.fromClient)),
    flatMap(fromClient(state$))
  );

const updateGameIdsEpic: t.Epic = (action$, state$) =>
  action$.pipe(
    filter(ta.isActionOf(a.newGame)),
    flatMap(action => {
      action.payload.id;
      const userIds = state$.value.users.keySeq().toArray();
      const gameIds = state$.value.games.keySeq().toArray();
      return userIds.map(userId =>
        a.sendAction(userId, ca.setGameIds(gameIds))
      );
    })
  );

const refreshGameStateEpic: t.Epic = (action$, state$) =>
  action$.pipe(
    filter(ta.isActionOf(a.refreshGameState)),
    flatMap(action => {
      const gameId = action.payload.id;
      const game = lens.game(action.payload.id).get(state$.value);
      if (game.isSome()) {
        return game.value.players
          .keySeq()
          .toArray()
          .map(id => a.sendAction(id, ca.setGame(game.value)));
      } else {
        console.error("this invariant should not happen");
        return [a.noOp()];
      }
    })
  );

const sendActionEpic: t.Epic = (action$, state$) =>
  action$.pipe(
    filter(ta.isActionOf(a.sendAction)),
    map(action => {
      const socket = lens.user(action.payload.id).get(state$.value);
      if (socket.isSome()) {
        socket.value.socket.emit(
          "action",
          transit.toJSON(action.payload.clientAction)
        );
      } else {
        console.error(
          `Client: ${action.payload.id} is not connected to the server`
        );
      }
      return a.noOp();
    })
  );

const sendMessageEpic: t.Epic = (action$, state$) =>
  action$.pipe(
    filter(ta.isActionOf(a.sendMessage)),
    map(action => {
      const socket = lens.user(action.payload.id).get(state$.value);
      if (socket.isSome()) {
        socket.value.socket.emit(
          "message",
          transit.toJSON(action.payload.message)
        );
      } else {
        console.error(
          `Client: ${action.payload.id} is not connected to the server`
        );
      }
      return a.noOp();
    })
  );

const clientWebsocketEpic: t.Epic = (action$, state$) =>
  action$.pipe(
    filter(ta.isActionOf(a.connectWebsocket)),
    flatMap(action => {
      const socketServer = io(action.payload.httpServer);
      return fromEventPattern<t.RootAction>(
        add => {
          socketServer.on("connection", (socket: any) => {
            const userId = uuid4();
            // Add this user to the server.
            add(a.addUser(userId, socket));
            // Send message about connecting.
            add(a.sendMessage(userId, "thanks for connecting."));
            add(a.sendAction(userId, ca.setPlayerId(userId)));
            add(
              a.sendAction(
                userId,
                ca.setGameIds(state$.value.games.keySeq().toArray())
              )
            );

            // This any is actually events that the client can send?
            socket.on("client action", (clientActionString: any) => {
              const clientAction = transit.fromJSON(clientActionString);
              add(a.fromClient(userId, clientAction));
            });

            socket.on("disconnect", (reason: string) => {
              add(a.removeUser(userId));
            });
          });
        },
        // TODO - still need to make sure that sockets can be unsubscribed from.
        (remove: any) => {
          socketServer.on("disconnection", (socket: any) => {
            console.log("a disconnect happened");
            // TODO - what to do here?
          });
        }
      );
    })
  );

const logActionEpic: t.Epic = (action$, state$) =>
  action$.pipe(
    filter(action => !ta.isActionOf(a.noOp)(action)),
    map(action => {
      console.log();
      console.log(action.type);
      const loggable = {
        games: state$.value.games,
        clients: state$.value.users.map(u => u.id)
      };
      console.log(JSON.stringify(loggable, undefined, "  "));
      return a.noOp();
    })
  );

const rootEpic = ro.combineEpics(
  refreshGameStateEpic,
  // logActionEpic,
  clientWebsocketEpic,
  sendMessageEpic,
  sendActionEpic,
  updateGameIdsEpic,
  fromClientEpic
);
const createEpicMiddleware = () =>
  ro.createEpicMiddleware<t.RootAction, t.RootAction, t.ServerReduxState>();

export const createStore = () => {
  const middleware = createEpicMiddleware();
  const store = redux.createStore(app, redux.applyMiddleware(middleware));
  middleware.run(rootEpic);
  return store;
};
