import uuid4 from "uuid/v4";
import * as t from "../types";
import R from "ramda";
import shuffle from "shuffle-array";

import words from "../../../src/redux/words";
import { fgForHex } from "../../../src/util";

import {
  hintTextPath,
  currentTeamPath,
  foregroundColorForTeamPath,
  backgroundColorForTeamPath,
  hintPath,
  gameUsersPath,
  cardsPath,
  usersPath as users,
  gamesPath as games
} from "./paths";

export const newCards = () => {
  shuffle(words);
  let numAssassins = 1;
  let numBystanders = 7;
  const biggerTeam = 9;
  const smallerTeam = 8;
  let numTeam1 = Math.random() > 0.5 ? biggerTeam : smallerTeam;
  let numTeam2 = numTeam1 === smallerTeam ? biggerTeam : smallerTeam;

  const nextTeam = () => {
    if (numAssassins > 0) {
      numAssassins--;
      return t.Team.ASSASSIN;
    } else if (numBystanders > 0) {
      numBystanders--;
      return t.Team.BYSTANDER;
    } else if (numTeam1 > 0) {
      numTeam1--;
      return t.Team.TEAM_1;
    } else if (numTeam2 > 0) {
      numTeam2--;
      return t.Team.TEAM_2;
    } else {
      throw 'There weren\'t enough team thingys';
    }
  };

  let cards: any = R.take(25, words);
  cards = R.map(
    text => ({
      text,
      flipped: false,
      team: nextTeam()
    }),
    cards
  );
  cards = R.map(card => R.assoc("id", uuid4(), card), cards);
  cards = shuffle(cards);
  cards = R.reduce(
    (acc, card: t.Card) => R.assoc(card.id, card, acc),
    {},
    cards
  );

  return cards;
};

export const newGame = () => {
  let baseGame = {};
  baseGame = R.set(
    backgroundColorForTeamPath(t.Team.TEAM_1),
    "#f44336",
    baseGame
  );
  baseGame = R.set(
    foregroundColorForTeamPath(t.Team.TEAM_1),
    fgForHex("#f44336"),
    baseGame
  );
  baseGame = baseGame = R.set(
    backgroundColorForTeamPath(t.Team.TEAM_2),
    "#2196f3",
    baseGame
  );
  baseGame = R.set(
    foregroundColorForTeamPath(t.Team.TEAM_2),
    fgForHex("#2196f3"),
    baseGame
  );
  baseGame = baseGame = R.set(
    backgroundColorForTeamPath(t.Team.ASSASSIN),
    "#000000",
    baseGame
  );
  baseGame = R.set(
    foregroundColorForTeamPath(t.Team.ASSASSIN),
    fgForHex("#000000"),
    baseGame
  );
  baseGame = baseGame = R.set(
    backgroundColorForTeamPath(t.Team.BYSTANDER),
    "#686868",
    baseGame
  );
  baseGame = R.set(
    foregroundColorForTeamPath(t.Team.BYSTANDER),
    fgForHex("#686868"),
    baseGame
  );
  baseGame = baseGame = R.set(hintTextPath, "", baseGame);
  baseGame = R.set(hintPath, {}, baseGame);
  baseGame = R.set(gameUsersPath, [], baseGame);
  baseGame = R.set(cardsPath, newCards(), baseGame);
  const currentTeam = R.compose(
    R.ifElse(R.equals(9), R.always(t.Team.TEAM_1), R.always(t.Team.TEAM_2)),
    R.length,
    R.keys,
    R.filter(({ team: cardTeam }) => cardTeam === t.Team.TEAM_1)
  )(R.view(cardsPath, baseGame));
  return R.compose(R.set(currentTeamPath, currentTeam))(baseGame);
};

export const initialState: t.ServerReduxState = (() => {
  let s = {};
  s = R.set(users, [], s);
  s = R.set(games, [], s);
  return s;
})();
