import * as t from "../types";
import R from "ramda";

const localStateA = ["localState"];
const usersA = [...localStateA, "users"];
const gamesA = [...localStateA, "games"];
const gameByGameIdA = (gameId: t.GameId) => [...gamesA, gameId];
const userByUserIdA = (userId: string) => [...usersA, userId];
const wsByUserIdA = (userId: string) => [...userByUserIdA(userId), "ws"];
const cardsA = ["cards"];
const cardByIdA = (cardId: t.CardId) => [...cardsA, cardId];
const cardTeamByCardIdA = (cardId: t.CardId) => [...cardByIdA(cardId), "team"];
const gameUsersA = ["users"];
const hintA = ["hint"];
const hintTextA = [...hintA, "text"];
const hintNumberA = [...hintA, "number"];
const hintSubmittedA = [...hintA, "submitted"];
const styleA = ["style"];
const styleForTeamA = (team: t.Team) => [...styleA, team];
const foregroundColorForTeamA = (team: t.Team) => [
  ...styleForTeamA(team),
  "color"
];
const backgroundColorForTeamA = (team: t.Team) => [
  ...styleForTeamA(team),
  "backgroundColor"
];
const currentTeamA = ["currentTeam"];

export const usersPath = R.lensPath(usersA);
export const gamesPath = R.lensPath(gamesA);
export const gameByGameIdPath = (gameId: t.GameId) =>
  R.lensPath(gameByGameIdA(gameId));
export const userByUserIdPath = (userId: string) =>
  R.lensPath(userByUserIdA(userId));
export const wsByUserIdPath = (userId: string) =>
  R.lensPath(wsByUserIdA(userId));
export const cardsPath = R.lensPath(cardsA);
export const cardTeamByCardId = (cardId: t.CardId) =>
  R.lensPath(cardTeamByCardIdA(cardId));
export const gameUsersPath = R.lensPath(gameUsersA);
export const hintPath = R.lensPath(hintA);
export const hintTextPath = R.lensPath(hintTextA);
export const hintNumberPath = R.lensPath(hintNumberA);
export const hintSubmittedPath = R.lensPath(hintSubmittedA);
export const styleForTeamPath = (team: t.Team) =>
  R.lensPath(styleForTeamA(team));
export const foregroundColorForTeamPath = (team: t.Team) =>
  R.lensPath(foregroundColorForTeamA(team));
export const backgroundColorForTeamPath = (team: t.Team) =>
  R.lensPath(backgroundColorForTeamA(team));
export const currentTeamPath = R.lensPath(currentTeamA);
