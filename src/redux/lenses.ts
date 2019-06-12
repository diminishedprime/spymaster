import * as t from "../types";
import * as l from "lens.ts";

const reduxState = l.lens<t.ReduxState>();
const localState = reduxState.k("localState");

export const userId = localState.k("userId");
export const gameIds = localState.k("gameIds");
