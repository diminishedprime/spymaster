import * as t from "../types";
import * as fp from "fp-ts";

export const newScore = () => {
  return {
    TEAM_1: 0,
    TEAM_2: 0
  };
};

export const initialUsersList = {};
export const initialHint = {
  text: "",
  number: "",
  submitted: false
};

const newState = (s = {}): t.ReduxState => {
  const s2: t.ReduxState = {
    localState: {
      error: fp.option.none,
      ws: undefined,
      userId: undefined,
      connected: false,
      username: "",
      serverAddress: "dev.mjh.io",
      settings: {
        showTitle: true
      },
      page: t.Page.LOBBY,
      gameIds: [],
      playerType: {
        team: t.Team.TEAM_1,
        role: t.Role.SPYMASTER
      }
    },
    remoteState: fp.option.none
  };
  return s2;
};

export const initialState: t.ReduxState = newState({});
