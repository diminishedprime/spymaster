import * as ro from "redux-observable";
import { createStore, applyMiddleware } from "redux";
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
  gameIds: []
};

export const lens = (() => {
  const reduxStateLens = m.Lens.fromProp<t.ReduxState2>();

  const socket = reduxStateLens("socket");
  const page = reduxStateLens("page");
  const inLobby = page.composeGetter(new m.Getter(p => p === t.Page.Lobby));

  const gameIds = reduxStateLens("gameIds");

  return {
    socket,
    page,
    inLobby,
    gameIds
  };
})();

const app = ta
  .createReducer(initialState)
  .handleAction(a.setSocket, (state, { payload }) =>
    lens.socket.set(t.some(payload.socket))(state)
  )
  .handleAction(a.setGameIds, (state, { payload }) =>
    lens.gameIds.set(payload.gameIds)(state)
  );

const logActionEpic: t.Epic = (action$, state$) =>
  action$.pipe(
    filter(action => !ta.isActionOf(a.noOp)(action)),
    map(action => {
      console.log({ action, state: state$.value });
      return a.noOp();
    })
  );

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
            console.log("disconnecting?");
            // a.setSocket(none)
          });
        }
      );
    })
  );

const rootEpic = ro.combineEpics(websocketEpic, logActionEpic);
const epicMiddleware = ro.createEpicMiddleware<
  t.RootAction,
  t.RootAction,
  t.ReduxState2
>();
export const store = createStore(app, applyMiddleware(epicMiddleware));
epicMiddleware.run(rootEpic);
