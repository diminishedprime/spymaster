import app from "./app";
import websocket from "./websocket";
import * as effects from "redux-saga/effects";

export const rootSaga = function* () {
  yield effects.all([app(), websocket()]);
};
