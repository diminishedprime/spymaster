import createSagaMiddleware from "redux-saga";
import * as i from "immutable";
import * as t from "../types";
import { createStore, applyMiddleware } from "redux";
import * as ta from "typesafe-actions";
import * as m from "monocle-ts";
import * as a from "./actions";
import { rootSaga } from "./sagas/index";

const initialState: t.ServerReduxState = {
  games: i.Map(),
  users: i.Map(),
  server: t.none
};

const serverReduxStateLens = m.Lens.fromProp<t.ServerReduxState>();

const lens = {
  server: serverReduxStateLens("server"),
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

const app = ta
  .createReducer(initialState)
  .handleAction(a.addUser, (state, { payload }) =>
    lens.user(payload.id).set(t.some(payload))(state)
  )
  .handleAction(a.connectWebsocket, (state, { payload }) =>
    lens.server.set(t.some(payload.httpServer))(state)
  );

const sagaMiddleware = createSagaMiddleware();
export const store = createStore(app, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);
