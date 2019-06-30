import * as fp from "fp-ts";
import * as i from "immutable";

export const none = fp.option.none;
export const some = fp.option.some;
export const fromNullable = fp.option.fromNullable;
export type Option<T> = fp.option.Option<T>;

export type GameId = string;
export type CardId = string;
export type PlayerId = string;
export type UserId = string;
export type Players = i.Map<PlayerId, Player>;
export type Cards = i.Map<CardId, Card>;

export interface Card {
  id: CardId;
  text: string;
  team: Team;
  flipped: boolean;
}

export enum Team {
  Assassin = "Assassin",
  Spymaster = "Spymaster",
  Bystander = "Bystander",
  Team1 = "Team 1",
  Team2 = "Team 2"
}

export interface Player {
  id: PlayerId;
  alias: Option<string>;
  team: Team;
}

export interface Game {
  id: GameId;
  // alais: Option<string>;
  // cards: Cards;
  players: Players;
}

export enum Page {
  Lobby = "Lobby",
  Game = "Game"
}
