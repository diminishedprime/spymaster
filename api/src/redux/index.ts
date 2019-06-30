import createSagaMiddleware from "redux-saga";
import io from "socket.io";
import uuid4 from "uuid/v4";
import * as i from "immutable";
import * as ro from "redux-observable";
import * as t from "../types";
import { createStore, applyMiddleware } from "redux";
import { filter, flatMap, map } from "rxjs/operators";
import { fromEventPattern } from "rxjs";
import * as ta from "typesafe-actions";
import * as m from "monocle-ts";
import * as a from "./actions";
import * as ca from "../../../src/redux/actions";

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

const lens = {
  server: serverReduxStateLens("server"),
  games: serverReduxStateLens("games"),
  game: (id: t.GameId) => {
    const getter = (a: t.Games) => t.fromNullable(a.get(id));
    const setter = (c: t.Option<t.Game>) => (cs: t.Games) =>
      c.isSome() ? cs.set(c.value.id, c.value) : cs;
    return serverReduxStateLens("games").compose(
      new m.Lens<t.Games, t.Option<t.Game>>(getter, setter)
    );
  },
  users: serverReduxStateLens("users"),
  user: (id: t.UserId) => {
    const getter = (a: t.Users) => t.fromNullable(a.get(id));
    const setter = (c: t.Option<t.User>) => (cs: t.Users) =>
      c.isSome() ? cs.set(c.value.id, c.value) : cs;
    return serverReduxStateLens("users").compose(
      new m.Lens<t.Users, t.Option<t.User>>(getter, setter)
    );
  }
};

const newGame = (id: t.GameId): t.Game => ({ id, players: i.Set() });

const app = ta
  .createReducer(initialState)
  .handleAction(a.newGame, (state, { payload }) =>
    lens.game(payload.id).set(t.some(newGame(payload.id)))(state)
  )
  .handleAction(a.addUser, (state, { payload }) =>
    lens.user(payload.id).set(t.some(payload))(state)
  )
  .handleAction(a.connectWebsocket, (state, { payload }) =>
    lens.server.set(t.some(payload.httpServer))(state)
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

const newGameClientEpic: t.Epic = action$ =>
  action$.pipe(
    filter(
      action =>
        ta.isActionOf(a.fromClient)(action) &&
        ta.isActionOf(ca.newGame)(action.payload.clientAction)
    ),
    map(_ => {
      const id = uuid4();
      return a.newGame(id);
    })
  );

const sendActionEpic: t.Epic = (action$, state$) =>
  action$.pipe(
    filter(ta.isActionOf(a.sendAction)),
    map(action => {
      const socket = lens.user(action.payload.id).get(state$.value);
      if (socket.isSome()) {
        socket.value.socket.emit("action", action.payload.clientAction);
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
        socket.value.socket.emit("message", action.payload.message);
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
      console.log("connectWebsocket happened.");
      const socketServer = io(action.payload.httpServer);
      return fromEventPattern<t.RootAction>(
        add => {
          socketServer.on("connection", (socket: any) => {
            console.log("there was a connection");
            const userId = uuid4();
            // Add this user to the server.
            add(a.addUser(userId, socket));
            // Send message about connecting.
            add(a.sendMessage(userId, "thanks for connecting."));
            add(
              a.sendAction(
                userId,
                ca.setGameIds(state$.value.games.keySeq().toArray())
              )
            );

            // This any is actually events that the client can send?
            socket.on("client action", (clientAction: any) => {
              console.log("a client action happened", { clientAction });
              add(a.fromClient(userId, clientAction));
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

const rootEpic = ro.combineEpics(
  clientWebsocketEpic,
  sendMessageEpic,
  sendActionEpic,
  newGameClientEpic,
  updateGameIdsEpic
);
const epicMiddleware = ro.createEpicMiddleware<
  t.RootAction,
  t.RootAction,
  t.ServerReduxState
>();
export const store = createStore(app, applyMiddleware(epicMiddleware));
epicMiddleware.run(rootEpic);
