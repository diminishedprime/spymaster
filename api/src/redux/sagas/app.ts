import R from "ramda";
import uuid4 from "uuid/v4";
import * as t from "../../types";
import * as initialState from "../initial-state";
import * as actions from "../../../../src/redux/actions";
import * as paths from "../../../src/redux/paths";
import * as serverActions from "../actions";
import * as serverPaths from "../paths";
import * as effects from "redux-saga/effects";

const pushGameState = function*(gameId: t.GameId) {
  const remoteState = yield effects.select(
    R.view(serverPaths.gameByGameIdPath(gameId))
  );
  const remoteStateAction = actions.afUpdateRemoteState(remoteState);
  const userIds: t.UserId[] = R.view(serverPaths.gameUsersPath, remoteState);
  yield effects.put(
    serverActions.afBroadcastActionToUserIds(userIds, remoteStateAction)
  );
};

const wait = (millis: number) =>
  new Promise(resolve => {
    setTimeout(() => resolve(), millis);
  });

const removeUserFromGame = function*(gameId: t.GameId, userId: t.UserId) {
  const game = yield effects.select(
    R.view(serverPaths.gameByGameIdPath(gameId))
  );
  const gameUserIds: t.UserId[] = R.view(serverPaths.gameUsersPath, game);
  if (gameUserIds.indexOf(userId) > -1) {
    yield effects.put(serverActions.afRemoveUserFromGame(gameId, userId));
    yield pushGameState(gameId);
  }
};

const userDisconnected = function*() {
  yield effects.takeEvery<any>(
    t.ServerAsyncActionType.USER_DISCONNECTED,
    function*({ userId }: t.USER_DISCONNECTEDAction) {
      yield effects.put(serverActions.afRemoveUser(userId));
      const gameIds = yield effects.select(
        R.compose(
          R.keys,
          R.view(serverPaths.gamesPath)
        )
      );
      for (let i = 0; i < gameIds.length; i++) {
        const gameId = gameIds[i];
        yield removeUserFromGame(gameId, userId);
      }
    }
  );
};

const userConnected = function*() {
  yield effects.takeEvery<any>(
    t.ServerAsyncActionType.USER_CONNECTED,
    function*({ userId }: t.USER_CONNECTEDAction) {
      const setUsername = actions.afSetUsername(userId!.substring(0, 8));
      const setUserId = actions.afSetUserId(userId);
      const gameIds = yield effects.select(
        R.compose(
          R.keys,
          R.view(serverPaths.gamesPath)
        )
      );
      const setGameIds = actions.afSetGameIds(gameIds);
      yield effects.put(
        serverActions.afBroadcastActionToUserId(userId, setGameIds)
      );
      yield effects.put(
        serverActions.afBroadcastActionToUserId(userId, setUsername)
      );
      yield effects.put(
        serverActions.afBroadcastActionToUserId(userId, setUserId)
      );
      /* yield forceUpdateRemoteState()*/
    }
  );
};

const loseGame = function*(teamThatLost: t.Team) {
  yield effects.put(actions.afForfeit(teamThatLost));
  yield effects.put(actions.afStopTimer());
  /*yield forceUpdateRemoteState()*/
};

const zeroRemainingCards = (team: t.Team, cards: t.Card[]) => {
  const cardsForTeam = cards.filter(
    ({ team: t, flipped }) => t === team && !flipped
  );
  return cardsForTeam.length === 0;
};

const flipCard = function*() {
  yield effects.takeEvery<any>(t.ActionType.FLIP_CARD, function*({
    cardId
  }: t.FlipCard) {
    // Always flip the card, because that's a safe thing to do
    yield effects.put(actions.afSetCardFlipped(cardId));
    /* yield forceUpdateRemoteState()*/

    const state = yield effects.select(R.identity);
    const cards: t.Card[] = R.view(paths.cardsPath, state);
    const teamForCard = R.view(paths.cardTeamByCardId(cardId), state);
    const currentTeam: t.Team = R.view(paths.currentTeamPath, state);

    const correctCard = currentTeam === teamForCard;
    const pickedAssassin = teamForCard === t.Team.ASSASSIN;
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
          yield effects.put(actions.afNextTurn());
          yield effects.put(actions.afStopTimer());
          /* yield forceUpdateRemoteState()*/
        } else {
          yield effects.put(actions.afUpdateHintNumber(asNumber));
          /* yield forceUpdateRemoteState()*/
        }
      }
    } else {
      yield effects.put(actions.afStopTimer());
      yield effects.put(actions.afNextTurn());
      /* yield forceUpdateRemoteState()*/
    }
  });
};

const nextTurn = function*() {
  yield effects.takeEvery<any>(t.ActionType.NEXT_TURN, function*() {
    yield effects.put(actions.afStopTimer());
  });
};

const timer = function*() {
  yield effects.takeEvery<any>(t.ActionType.START_TIMER, function*() {
    let wasStopped = false;
    let seconds = 60;
    yield effects.put(actions.afSetTime(seconds));
    for (; seconds >= 0; seconds--) {
      const { stopped } = yield effects.race({
        stopped: effects.take(t.ActionType.STOP_TIMER),
        tick: effects.call(wait, 1000)
      });
      if (stopped) {
        wasStopped = true;
        break;
      } else {
        yield effects.put(actions.afSetTime(seconds));
        /* yield forceUpdateRemoteState()*/
      }
    }
    if (!wasStopped) {
      yield effects.put(actions.afNextTurn());
      /* yield forceUpdateRemoteState()*/
    }
  });
};

const joinGame = function*() {
  yield effects.takeEvery<any>(t.ActionType.JOIN_GAME, function*({
    userId,
    gameId
  }: t.JoinGame) {
    yield effects.put(serverActions.afJoinGameServer(userId, gameId));

    yield effects.put(
      serverActions.afBroadcastActionToUserId(
        userId,
        actions.afSetGameId(gameId)
      )
    );
    yield effects.put(
      serverActions.afBroadcastActionToUserId(
        userId,
        actions.afSetPage(t.Page.GAME_MODE_PICK_TEAM)
      )
    );
    yield pushGameState(gameId);
  });
};

const changeBackgroundColor = function*() {
  yield effects.takeEvery<any>(t.ActionType.CHANGE_BACKGROUND_COLOR, function*({
    gameId,
    team,
    backgroundColor
  }: // TODO figure out a better way to type this. I add gameId and userId to all outgoing actions, but since these are the client types it doesn't include that information.
  t.ChangeBackgroundColor & { gameId: t.GameId }) {
    yield effects.put(
      serverActions.afChangeBackgroundColorServer(gameId, team, backgroundColor)
    );
    yield pushGameState(gameId);
  });
};

const newGameSaga = function*() {
  yield effects.takeEvery<any>(t.ActionType.NEW_GAME_2, function*({
    userId
  }: t.NewGame2 & { userId: t.UserId }) {
    const gameId = uuid4();
    const gameState = initialState.newGame();
    yield effects.put(serverActions.afNewGameServer(gameId, gameState));

    const gameIds = yield effects.select(
      R.compose(
        R.keys,
        R.view(serverPaths.gamesPath)
      )
    );
    yield effects.put(
      serverActions.afBroadcastActionToAll(actions.afSetGameIds(gameIds))
    );

    yield effects.put(actions.afJoinGame(gameId, userId));
  });
};

const setRole = function*() {
  yield effects.takeEvery(t.ActionType.PICK_ROLE, function*({
    userId,
    ...action
  }: t.PickRole & { userId: t.UserId }) {
    yield effects.put(serverActions.afBroadcastActionToUserId(userId, action));
    yield effects.put(
      serverActions.afBroadcastActionToUserId(
        userId,
        actions.afSetPage(t.Page.GAME_MODE_GAME)
      )
    );
  });
};

export default function*() {
  yield effects.all([
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
