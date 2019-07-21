import * as ro from "redux-observable";
import transit from "../transit";
import * as redux from "redux";
import { filter, flatMap, map } from "rxjs/operators";
import * as m from "monocle-ts";
import * as ta from "typesafe-actions";
import * as a from "./actions";
import * as t from "../types";
import * as rr from "react-redux";
import * as io from "socket.io-client";
import { fromEventPattern } from "rxjs";

declare module "typesafe-actions" {
  interface Types {
    RootAction: t.RootAction;
  }
}

export const useDispatch = (): t.Dispatch => {
  return (rr as any).useDispatch();
};

export const useSelector = <T>(
  selector: (t: t.ReduxState2) => T,
  equalityFn?: (t1: T, t2: T) => boolean
): T => {
  return (rr as any).useSelector(selector, equalityFn);
};

const initialState: t.ReduxState2 = {
  socket: t.none,
  page: t.Page.Lobby,
  gameIds: [],
  game: t.none,
  playerId: t.none
};

export const lens = (() => {
  const reduxStateLens = m.Lens.fromProp<t.ReduxState2>();

  const socket = reduxStateLens("socket");
  const page = reduxStateLens("page");
  const game = reduxStateLens("game");
  const inLobby = page.composeGetter(new m.Getter(p => p === t.Page.Lobby));
  const inGame = page.composeGetter(new m.Getter(p => p === t.Page.Game));
  const gameId = game.composeGetter(new m.Getter(g => g.map(g => g.id)));
  const hasNecessaryPlayers = game.composeGetter(
    new m.Getter(g => g.map(g => g.hasNecessaryPlayers))
  );
  const player = (userId: t.Option<t.UserId>) =>
    game.composeGetter(
      new m.Getter(g =>
        g.chain(g =>
          userId.chain(userId => t.fromNullable(g.players.get(userId)))
        )
      )
    );
  const team = (userId: t.Option<t.UserId>) =>
    player(userId).composeGetter(new m.Getter(p => p.chain(p => p.team)));
  const role = (userId: t.Option<t.UserId>) =>
    player(userId).composeGetter(new m.Getter(p => p.chain(p => p.role)));
  const isSpymaster = (userId: t.Option<t.UserId>) =>
    role(userId).composeGetter(
      new m.Getter(r => r.map(r => r === t.Role.Spymaster))
    );
  const isGuesser = (userId: t.Option<t.UserId>) =>
    role(userId).composeGetter(
      new m.Getter(r => r.map(r => r === t.Role.Guesser))
    );
  const playerId = reduxStateLens("playerId");

  const cards = game.composeGetter(new m.Getter(g => g.chain(g => g.cards)));
  const started = game.composeGetter(new m.Getter(g => g.map(g => g.started)));

  const hint = game.composeGetter(new m.Getter(g => g.chain(g => g.hint)));

  const gameIds = reduxStateLens("gameIds");

  const isCurrentTurn = new m.Getter<t.ReduxState2, t.Option<boolean>>(
    reduxState => {
      const id = playerId.get(reduxState);
      const t = team(id).get(reduxState);
      return game
        .get(reduxState)
        .chain(g => g.currentTeam.chain(ct => t.map(t => t === ct)));
    }
  );

  const isCurrentSpymaster = new m.Getter<t.ReduxState2, t.Option<boolean>>(
    reduxState => {
      const id = playerId.get(reduxState);
      const isCurrent = isCurrentTurn.get(reduxState);
      const isSpy = isSpymaster(id).get(reduxState);
      return isSpy.chain(isSpy =>
        isCurrent.map(isCurrent => isCurrent && isSpy)
      );
    }
  );

  const hintSubmitted = game.composeGetter(
    new m.Getter(g => g.chain(g => g.hintSubmitted))
  );

  return {
    hintSubmitted,
    isCurrentSpymaster,
    hint,
    isGuesser,
    isSpymaster,
    started,
    cards,
    hasNecessaryPlayers,
    role,
    team,
    playerId,
    gameId,
    inGame,
    game,
    socket,
    page,
    inLobby,
    gameIds
  };
})();

const app = ta
  .createReducer(initialState)
  .handleAction(a.setPlayerId, (state, { payload }) =>
    lens.playerId.set(t.some(payload.id))(state)
  )
  .handleAction(a.setPage, (state, { payload }) =>
    lens.page.set(payload.page)(state)
  )
  .handleAction(a.setGame, (state, { payload }) =>
    lens.game.set(t.some(payload.game))(state)
  )
  .handleAction(a.setSocket, (state, { payload }) =>
    lens.socket.set(t.some(payload.socket))(state)
  )
  .handleAction(a.setGameIds, (state, { payload }) =>
    lens.gameIds.set(payload.gameIds)(state)
  );

const sendActionEpic: t.Epic = (action$, state$) =>
  action$.pipe(
    // Extend this filter for events that should be sent to the server.
    filter(action =>
      ta.isActionOf([
        a.newGame,
        a.joinGame,
        a.requestTeam,
        a.requestRole,
        a.startGame,
        a.setHint,
        a.sendHint
      ])(action)
    ),
    map(action => {
      const socket = state$.value.socket;
      if (socket.isSome()) {
        socket.value.emit("client action", transit.toJSON(action));
      } else {
        console.error("No socket connected.");
      }
      return a.noOp();
    })
  );

const logActionEpic: t.Epic = (action$, state$) =>
  action$.pipe(
    filter(action => !ta.isActionOf(a.noOp)(action)),
    map(action => {
      console.log(action.type, { action, state: state$.value });
      return a.noOp();
    })
  );

const websocketEpic: t.Epic = action$ =>
  action$.pipe(
    filter(ta.isActionOf(a.connectWebsocket)),
    flatMap(action => {
      const socket = io.connect(action.payload.url);
      return fromEventPattern<t.RootAction>(
        (add: any) => {
          add(a.setSocket(socket));
          socket.on("message", (messageString: any) => {
            const message = transit.fromJSON(messageString);
            console.log({ message });
          });
          socket.on("action", (messageAction: any) => {
            const action = transit.fromJSON(messageAction);
            add(action);
          });
        },
        (remove: any) => {
          socket.on("disconnect", () => {
            console.log("disconnecting?");
            // a.setSocket(none)
          });
        }
      );
    })
  );

const rootEpic = ro.combineEpics(websocketEpic, logActionEpic, sendActionEpic);

const createEpicMiddleware = () =>
  ro.createEpicMiddleware<t.RootAction, t.RootAction, t.ReduxState2>();

export const createStore = () => {
  const middleware = createEpicMiddleware();
  const store = redux.createStore(app, redux.applyMiddleware(middleware));
  middleware.run(rootEpic);
  return store;
};
