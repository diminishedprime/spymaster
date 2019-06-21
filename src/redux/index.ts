import createSagaMiddleware from "redux-saga";
import io from "socket.io";
import * as ro from "redux-observable";
import * as t from "../types";
import { createStore, applyMiddleware } from "redux";
import { filter, map } from "rxjs/operators";
import { fromEventPattern } from "rxjs";
import * as ta from "typesafe-actions";
import * as m from "monocle-ts";
import * as a from "./actions";

const initialState: t.ReduxState2 = {};

const app = ta.createReducer(initialState);

const websocketEpic: ro.Epic<
  t.RootAction,
  t.RootAction,
  t.ReduxState
> = action$ =>
  action$.pipe(
    filter(ta.isActionOf(a.connectWebsocket)),
    map(action => action)
  );

const rootEpic = ro.combineEpics(websocketEpic);
const epicMiddleware = ro.createEpicMiddleware<
  t.RootAction,
  t.RootAction,
  t.ReduxState
>();
export const store = createStore(app, applyMiddleware(epicMiddleware));
epicMiddleware.run(rootEpic);
