import * as ro from "redux-observable";
import { createStore, applyMiddleware } from "redux";
import { filter, flatMap } from "rxjs/operators";
import * as ta from "typesafe-actions";
import * as a from "./actions";
import * as t from "../types";
import * as rr from "react-redux";
import * as io from "socket.io-client";
import { fromEventPattern } from "rxjs";

export const useDispatch = (): t.Dispatch => {
  return (rr as any).useDispatch();
};

export const useSelector = <T>(
  selector: (t: t.ReduxState2) => T,
  equalityFn?: (t1: T, t2: T) => boolean
) => {
  return (rr as any).useSelector(selector, equalityFn);
};

const initialState: t.ReduxState2 = {};

const app = ta.createReducer(initialState);

const websocketEpic: t.Epic = action$ =>
  action$.pipe(
    filter(ta.isActionOf(a.connectWebsocket)),
    flatMap(action => {
      console.log("connect websocket to server");
      const socket = io.connect(action.payload.url);
      return fromEventPattern<t.RootAction>(
        (add: any) => {
          add(a.setSocket(socket));
          socket.on("message", (message: any) => {
            console.log({ message });
          });
          socket.on("action", (action: any) => {
            add(action);
          });
        },
        (remove: any) => {
          socket.on("disconnect", () => {
            // a.setSocket(none)
          });
        }
      );
    })
  );

const rootEpic = ro.combineEpics(websocketEpic);
const epicMiddleware = ro.createEpicMiddleware<
  t.RootAction,
  t.RootAction,
  t.ReduxState2
>();
export const store = createStore(app, applyMiddleware(epicMiddleware));
epicMiddleware.run(rootEpic);
