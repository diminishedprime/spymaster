import * as t from "../types";
import * as l from "lens.ts";

const reduxState = l.lens<t.ReduxState>();

const localState = reduxState.localState;
export const userId = localState.userId;
export const gameIds = localState.gameIds;
export const connected = localState.connected;
export const playerType = localState.playerType;
export const role = playerType.role;
export const team = playerType.team;

export const remoteState = reduxState.remoteState;
export const currentTeam = remoteState && remoteState.currentTeam;
export const hintSubmitted = remoteState && remoteState.hint.submitted;
export const cards = remoteState && remoteState.cards;
export const card = (cardId: t.CardId) => {
  if (!cards) {
    return undefined;
  }
  const getter = (s: t.ReduxState) => cards.get()(s)[cardId];
  const setter = (card: t.Card) =>
    cards.set((old: t.Cards) => ({ ...old, [card.id]: card }));
  return l.lens<t.ReduxState, t.Card>(getter, setter);
};

export const cardFlipped = (cardId: t.CardId) => {
  const lens = card(cardId);
  return lens === undefined ? lens : lens.flipped;
};

export const cardText = (cardId: t.CardId) => {
  const lens = card(cardId);
  return lens === undefined ? lens : lens.text;
};

export const cardTeam = (cardId: t.CardId) => {
  const lens = card(cardId);
  return lens === undefined ? lens : lens.team;
};

export const style = remoteState && remoteState.style;

export const teamStyle = (team: t.Team) => {
  const lens = style;
  if (!lens) {
    return undefined;
  }
  const getter = (s: t.ReduxState) => lens.get()(s)[team];
  const setter = (style: React.CSSProperties) =>
    lens.set((old: t.Style) => ({ ...old, [team]: style }));
  return l.lens<t.ReduxState, React.CSSProperties>(getter, setter);
};

// const time = [...remoteState, "time"];
// const error = [...localState, "error"];
// const errorText = [...error, "text"];
// const errorSeverity = [...error, "severity"];
// const settings = [...localState, "settings"];
// const showTitle = [...settings, "showTitle"];
// const styleA = [...remoteState, "style"];
// const styleForTeamA = (team: t.Team) => [...styleA, team];
// const foregroundColorForTeamA = (team: t.Team) => [
//   ...styleForTeamA(team),
//   "color"
// ];
// const backgroundColorForTeamA = (team: t.Team) => [
//   ...styleForTeamA(team),
//   "backgroundColor"
// ];

// const currentTeam = [...remoteState, "currentTeam"];
// const ws = [...localState, "ws"];
// const username = [...localState, "username"];
// const editing = [...localState, "editing"];
// const pageA = [...localState, "page"];

// const clientUsers = [...remoteState, "clientUsers"];

// const hint = [...remoteState, "hint"];
// const hintText = [...hint, "text"];
// const hintNumber = [...hint, "number"];
// const hintSubmitted = [...hint, "submitted"];
// const winner = [...remoteState, "winner"];
// const score = [...remoteState, "score"];
// const serverAddress = [...localState, "serverAddress"];

// export const scorePath = R.lensPath([...score]);
// export const winnerPath = R.lensPath([...winner]);
// export const hintPath = R.lensPath([...hint]);
// export const hintSubmittedPath = R.lensPath([...hintSubmitted]);
// export const hintTextPath = R.lensPath([...hintText]);
// export const hintNumberPath = R.lensPath([...hintNumber]);
// export const remoteStatePath = R.lensPath([...remoteState]);
// export const settingsPath = R.lensPath([...settings]);
// export const timePath = R.lensPath([...time]);
// export const errorPath = R.lensPath([...error]);
// export const errorTextPath = R.lensPath([...errorText]);
// export const errorSeverityPath = R.lensPath([...errorSeverity]);
// export const showTitlePath = R.lensPath([...showTitle]);
// export const playerTypePath = R.lensPath([...playerType]);
// export const rolePath = R.lensPath([...role]);
// export const teamPath = R.lensPath([...team]);
// export const cardsPath = R.lensPath([...cards]);
// export const currentTeamPath = R.lensPath([...currentTeam]);
// export const cardByCardId = (cardId: t.CardId) =>
//   R.lensPath(cardByCardIdA(cardId));
// export const cardTeamByCardId = (cardId: t.CardId) =>
//   R.lensPath(cardTeamByCardIdA(cardId));
// export const cardFlippedByCardId = (cardId: t.CardId) =>
//   R.lensPath(cardFlippedByCardIdA(cardId));
// export const cardTextByCardId = (cardId: t.CardId) =>
//   R.lensPath(cardTextByCardIdA(cardId));
// export const wsPath = R.lensPath([...ws]);
// export const usernamePath = R.lensPath([...username]);
// export const editingPath = R.lensPath([...editing]);
// export const clientUsersPath = R.lensPath(clientUsers);
// export const page = R.lensPath(pageA);

// export const styleForTeamPath = (team: t.Team) =>
//   R.lensPath(styleForTeamA(team));
// export const foregroundColorForTeamPath = (team: t.Team) =>
//   R.lensPath(foregroundColorForTeamA(team));
// export const backgroundColorForTeamPath = (team: t.Team) =>
//   R.lensPath(backgroundColorForTeamA(team));
// export const serverAddressPath = R.lensPath(serverAddress);
