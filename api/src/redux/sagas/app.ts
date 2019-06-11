import R from "ramda";
import uuid4 from "uuid/v4";
import * as t from "../../types";
import * as initialState from "../initial-state";
import * as actions from "../../../../src/redux/actions";
import * as constants from "../../../../src/constants";
import * as paths from "../../../src/redux/paths";
import * as serverActions from "../actions";
import * as serverPaths from "../paths";
import * as saga from 'redux-saga/effects';

const pushGameState = function* (gameId: t.GameId) {
  const remoteState = yield saga.select(R.view(serverPaths.gameByGameIdPath(gameId)));
  const remoteStateAction = actions.afUpdateRemoteState(remoteState);
  const userIds: t.UserId[] = R.view(serverPaths.gameUsersPath, remoteState);
  yield saga.put(serverActions.afBroadcastActionToUserIds(userIds, remoteStateAction));
};

const wait = (millis: number) =>
  new Promise(resolve => {
    setTimeout(() => resolve(), millis);
  });

const removeUserFromGame = function* (gameId: t.GameId, userId: t.UserId) {
  const game = yield saga.select(R.view(serverPaths.gameByGameIdPath(gameId)));
  const gameUserIds: t.UserId[] = R.view(serverPaths.gameUsersPath, game);
  if (gameUserIds.indexOf(userId) > -1) {
    yield saga.put(serverActions.afRemoveUserFromGame(gameId, userId));
    yield pushGameState(gameId);
  }
};

const userDisconnected = function* () {
  yield saga.takeEvery<any>(t.ServerAsyncActionType.USER_DISCONNECTED, function* ({
    userId
  }: t.USER_DISCONNECTEDAction) {
    yield saga.put(serverActions.afRemoveUser(userId));
    const gameIds = yield saga.select(
      R.compose(
        R.keys,
        R.view(serverPaths.gamesPath)
      )
    );
    for (let i = 0; i < gameIds.length; i++) {
      const gameId = gameIds[i];
      yield removeUserFromGame(gameId, userId);
    }
  });
};

const userConnected = function* () {
  yield saga.takeEvery<any>(t.ServerAsyncActionType.USER_CONNECTED, function* ({
    userId
  }: t.USER_CONNECTEDAction) {
    const setUsername = actions.afSetUsername(userId.substring(0, 8));
    const setUserId = actions.afSetUserId(userId);
    const gameIds = yield saga.select(
      R.compose(
        R.keys,
        R.view(serverPaths.gamesPath)
      )
    );
    const setGameIds = actions.afSetGameIds(gameIds);
    yield saga.put(serverActions.afBroadcastActionToUserId(userId, setGameIds));
    yield saga.put(serverActions.afBroadcastActionToUserId(userId, setUsername));
    yield saga.put(serverActions.afBroadcastActionToUserId(userId, setUserId));
    /* yield forceUpdateRemoteState()*/
  });
};

const loseGame = function* (teamThatLost: t.Team) {
  yield saga.put(actions.afForfeit(teamThatLost));
  yield saga.put(actions.afStopTimer());
  /*yield forceUpdateRemoteState()*/
};

const zeroRemainingCards = (team: t.Team, cards: t.Card[]) => {
  const cardsForTeam = cards.filter(
    ({ team: t, flipped }) => t === team && !flipped
  );
  return cardsForTeam.length === 0;
};

const flipCard = function* () {
  yield saga.takeEvery<any>(t.ActionType.FLIP_CARD, function* ({
    cardId
  }: t.FlipCard) {
    // Always flip the card, because that's a safe thing to do
    yield saga.put(actions.afSetCardFlipped(cardId));
    /* yield forceUpdateRemoteState()*/

    const state = yield saga.select(R.identity);
    const cards: t.Card[] = R.view(paths.cardsPath, state);
    const teamForCard = R.view(paths.cardTeamByCardId(cardId), state);
    const currentTeam: t.Team = R.view(paths.currentTeamPath, state);

    const correctCard = currentTeam === teamForCard;
    const pickedAssassin = teamForCard === constants.ASSASSIN;
    const team1done = zeroRemainingCards(t.Team.TEAM_1, cards);
    const team2done = zeroRemainingCards(t.Team.TEAM_2, cards);

    if (pickedAssassin) {
      yield loseGame(currentTeam);
    } else if (team1done) {
      yield loseGame(t.Team.TEAM_2);
    } else if (team2done) {
      yield loseGame(t.Team.TEAM_1);
    } else if (correctCard) {
      // decrease the number of guesses if necessary
      const numGuesses: t.HintNumber = R.view(paths.hintNumberPath, state);
      if (!(numGuesses === "Infinity" || numGuesses === "Zero")) {
        const asNumber = numGuesses - 1;
        if (asNumber === 0) {
          yield saga.put(actions.afNextTurn());
          yield saga.put(actions.afStopTimer());
          /* yield forceUpdateRemoteState()*/
        } else {
          yield saga.put(actions.afUpdateHintNumber(asNumber));
          /* yield forceUpdateRemoteState()*/
        }
      }
    } else {
      yield saga.put(actions.afStopTimer());
      yield saga.put(actions.afNextTurn());
      /* yield forceUpdateRemoteState()*/
    }
  });
};

const nextTurn = function* () {
  yield saga.takeEvery<any>(t.ActionType.NEXT_TURN, function* () {
    yield saga.put(actions.afStopTimer());
  });
};

const timer = function* () {
  yield saga.takeEvery<any>(t.ActionType.START_TIMER, function* () {
    let wasStopped = false;
    let seconds = 60;
    yield saga.put(actions.afSetTime(seconds));
    for (; seconds >= 0; seconds--) {
      const { stopped } = yield saga.race({
        stopped: saga.take(t.ActionType.STOP_TIMER),
        tick: saga.call(wait, 1000)
      });
      if (stopped) {
        wasStopped = true;
        break;
      } else {
        yield saga.put(actions.afSetTime(seconds));
        /* yield forceUpdateRemoteState()*/
      }
    }
    if (!wasStopped) {
      yield saga.put(actions.afNextTurn());
      /* yield forceUpdateRemoteState()*/
    }
  });
};

const joinGame = function* () {
  yield saga.takeEvery<any>(t.ActionType.JOIN_GAME, function* ({
    userId,
    gameId
  }: t.JoinGame) {
    yield saga.put(serverActions.afJoinGameServer(userId, gameId));

    yield saga.put(serverActions.afBroadcastActionToUserId(userId, actions.afSetGameId(gameId)));
    yield saga.put(
      serverActions.afBroadcastActionToUserId(userId, actions.afSetPage(t.Page.GAME_MODE_PICK_TEAM))
    );
    yield pushGameState(gameId);
  });
};

const changeBackgroundColor = function* () {
  yield saga.takeEvery<any>(t.ActionType.CHANGE_BACKGROUND_COLOR, function* ({
    gameId,
    team,
    backgroundColor
  }: // TODO figure out a better way to type this. I add gameId and userId to all outgoing actions, but since these are the client types it doesn't include that information.
    t.ChangeBackgroundColor & { gameId: t.GameId }) {
    yield saga.put(serverActions.afChangeBackgroundColorServer(gameId, team, backgroundColor));
    yield pushGameState(gameId);
  });
};

const newGameSaga = function* () {
  yield saga.takeEvery<any>(t.ActionType.NEW_GAME_2, function* ({
    userId
  }: t.NewGame2 & { userId: t.UserId }) {
    const gameId = uuid4();
    const gameState = initialState.newGame();
    yield saga.put(serverActions.afNewGameServer(gameId, gameState));

    const gameIds = yield saga.select(
      R.compose(
        R.keys,
        R.view(serverPaths.gamesPath)
      )
    );
    yield saga.put(serverActions.afBroadcastActionToAll(actions.afSetGameIds(gameIds)));

    yield saga.put(actions.afJoinGame(gameId, userId));
  });
};

const setRole = function* () {
  yield saga.takeEvery(t.ActionType.PICK_ROLE, function* ({
    userId,
    ...action
  }: t.PickRole & { userId: t.UserId }) {
    yield saga.put(serverActions.afBroadcastActionToUserId(userId, action));
    yield saga.put(
      serverActions.afBroadcastActionToUserId(
        userId,
        actions.afSetPage(t.Page.GAME_MODE_GAME)
      )
    );
  });
};

export default function* () {
  yield saga.all([
    changeBackgroundColor(),
    setRole(),
    joinGame(),
    newGameSaga(),
    userConnected(),
    userDisconnected(),
    nextTurn(),
    timer(),
    flipCard()
  ]);
}
