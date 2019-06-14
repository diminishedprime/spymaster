import * as t from "../types";
import * as l from "lens.ts";

export const reduxState = l.lens<t.ReduxState>();
export const localState = reduxState.localState;
export const userId = localState.userId;
export const gameIds = localState.gameIds;
export const gameId = localState.gameId!;
export const connected = localState.connected;
export const playerType = localState.playerType;
export const role = playerType.role;
export const team = playerType.team;
export const remoteState = reduxState.remoteState!;
export const currentTeam = remoteState.currentTeam;
export const cards = remoteState.cards;
export const style = remoteState.style;
export const time = remoteState.time;
export const settings = localState.settings;
export const ws = localState.ws!;
export const username = localState.username;
export const page = localState.page;
export const clientUsers = remoteState.clientUsers;
export const hint = remoteState.hint;
export const hintText = hint.text;
export const hintNumber = hint.number;
export const hintSubmitted = hint.submitted;
export const winner = remoteState.winner!;
export const score = remoteState.score;
export const serverAddress = localState.serverAddress;

export const cardFlipped = (cardId: t.CardId) => {
  return card(cardId).flipped;
};
export const cardText = (cardId: t.CardId) => {
  return card(cardId).text;
};
export const cardTeam = (cardId: t.CardId) => {
  return card(cardId).team;
};
export const teamColor = (team: t.Team) => {
  return teamStyle(team)!.color!;
};
export const teamBackgroundColor = (team: t.Team) => {
  return teamStyle(team)!.backgroundColor!;
};
export const card = (cardId: t.CardId) => {
  const getter = (s: t.ReduxState) => {
    return cards.get()(s)[cardId];
  };
  const setter = (card: t.Card) => {
    return cards.set((old: t.Cards) => {
      return { ...old, [card.id]: card };
    });
  };
  return l.lens<t.ReduxState, t.Card>(getter, setter);
};

export const teamStyle = (team: t.Team) => {
  const lens = style;
  const getter = (s: t.ReduxState) => {
    return lens.get()(s)[team];
  };
  const setter = (style: React.CSSProperties) => {
    return lens.set((old: t.Style) => {
      return { ...old, [team]: style };
    });
  };
  return l.lens<t.ReduxState, React.CSSProperties>(getter, setter);
};
