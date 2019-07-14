import * as i from "immutable";
import * as option from "fp-ts/lib/Option";

export const none = option.none;
export const None = option.None;
export const some = option.some;
export const fromNullable = option.fromNullable;
export type Option<T> = option.Option<T>;

export type Hint = string;
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

export enum Role {
  Spymaster = "Spymaster",
  Guesser = "Guesser"
}

export enum Team {
  Assassin = "Assassin",
  Bystander = "Bystander",
  Team1 = "Team 1",
  Team2 = "Team 2"
}

export type PlayerTeam = Team.Team1 | Team.Team2;

export interface Player {
  id: PlayerId;
  alias: Option<string>;
  team: Option<PlayerTeam>;
  role: Option<Role>;
}

export interface Game {
  id: GameId;
  // alais: Option<string>;
  cards: Option<Cards>;
  players: Players;
  hasNecessaryPlayers: boolean;
  started: boolean;
  currentTeam: Option<PlayerTeam>;
  hint: Option<Hint>;
}

export enum Page {
  Lobby = "Lobby",
  Game = "Game"
}
