import R from "ramda";
import * as t from "../types";

import { TEAM_1, SPYMASTER, LOBBY } from "../constants";

import {
  gameIdsPath,
  remoteStatePath,
  clientUsersPath,
  scorePath,
  rolePath,
  teamPath,
  page,
  errorPath,
  showTitlePath,
  usernamePath,
  hintPath,
  timePath,
  serverAddressPath,
  connectedPath
} from "./paths";

export const newScore = () => ({
  TEAM_1: 0,
  TEAM_2: 0
});

const initialScore = newScore();

export const initialErrorState = {};
export const initialUsersList = {};
export const initialHint = {
  text: "",
  number: "",
  submitted: false
};

const newState = (s = {}): t.ReduxState => {
  const s2: t.ReduxState = {
    localState: {
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
    remoteState: "Not Connected"
  };
  return s2;
  // s = R.set(connectedPath, false, s);
  // s = R.set(serverAddressPath, "dev.mjh.io", s);
  // s = R.set(scorePath, initialScore, s);
  // s = R.set(timePath, undefined, s);
  // s = R.set(hintPath, initialHint, s);
  // s = R.set(usernamePath, "", s);
  // s = R.set(showTitlePath, true, s);
  // s = R.set(errorPath, initialErrorState, s);
  // s = R.set(page, LOBBY, s);
  // s = R.set(teamPath, TEAM_1, s);
  // s = R.set(rolePath, SPYMASTER, s);
  // s = R.set(clientUsersPath, {}, s);
  // s = R.set(gameIdsPath, [], s);
  // return s as t.ReduxState;
};

export const newGame = () => R.view(remoteStatePath, newState());

export const initialState: t.ReduxState = newState({});
