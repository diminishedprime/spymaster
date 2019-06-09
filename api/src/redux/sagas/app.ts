import R from 'ramda'
import uuid4 from 'uuid/v4'
import * as t from '../../types'

import {
  newGame,
} from '../initial-state'
import {
  afJoinGame,
  afSetGameId,
  afSetGameIds,
  afSetUserId,
  afStopTimer,
  afSetTime,
  afNextTurn,
  afSetCardFlipped,
  afUpdateHintNumber,
  afForfeit,
  afUpdateRemoteState,
  afSetUsername,
  afSetPage,
} from '../../../../src/redux/actions'
import {
  ASSASSIN,
} from '../../../../src/constants'
import {
  cardTeamByCardId,
  cardsPath,
  currentTeamPath,
  hintNumberPath,
} from '../../../src/redux/paths'
import {
  afRemoveUser,
  afChangeBackgroundColorServer,
  afJoinGameServer,
  afBroadcastActionToUserIds,
  afBroadcastActionToUserId,
  afBroadcastActionToAll,
  afNewGameServer,
  afRemoveUserFromGame,
} from '../actions'
import {
  gamesPath,
  gameUsersPath,
  gameByGameIdPath as gameByGameId,
} from '../paths'

import {
  put,
  all,
  takeEvery,
  race,
  take,
  call,
  select,
} from 'redux-saga/effects'
import { FlipCard } from '../../../../src/types';

const pushGameState = function* (gameId:t.GameId) {
  const remoteState = yield select(R.view(gameByGameId(gameId)))
  const remoteStateAction = afUpdateRemoteState(remoteState)
  const userIds: t.UserId[] = R.view(gameUsersPath, remoteState)
  yield put(afBroadcastActionToUserIds(userIds, remoteStateAction))
}

const wait = (millis: number) => (
  new Promise((resolve) => {
    setTimeout(() => resolve(), millis)
  })
)

const removeUserFromGame = function* (gameId: t.GameId, userId: t.UserId) {
  const game = yield select(R.view(gameByGameId(gameId)))
  const gameUserIds: t.UserId[] = R.view(gameUsersPath, game)
  if (gameUserIds.indexOf(userId) > -1) {
    yield put(afRemoveUserFromGame(gameId, userId))
    yield pushGameState(gameId)

  }
}

const userDisconnected = function* () {
  yield takeEvery<any>(t.ServerAsyncActionType.USER_DISCONNECTED, function* ({userId}: t.USER_DISCONNECTEDAction) {
    yield put(afRemoveUser(userId))
    const gameIds = yield select(R.compose(R.keys,R.view(gamesPath)))
    for (let i = 0; i < gameIds.length; i++) {
      const gameId = gameIds[i]
      yield removeUserFromGame(gameId, userId)
    }
  })
}

const userConnected = function* () {
  yield takeEvery<any>(t.ServerAsyncActionType.USER_CONNECTED, function* ({userId}: t.USER_CONNECTEDAction) {
    const setUsername = afSetUsername(userId.substring(0, 8))
    const setUserId = afSetUserId(userId)
    const gameIds = yield select(R.compose(R.keys,R.view(gamesPath)))
    const setGameIds = afSetGameIds(gameIds)
    yield put(afBroadcastActionToUserId(userId, setGameIds))
    yield put(afBroadcastActionToUserId(userId, setUsername))
    yield put(afBroadcastActionToUserId(userId, setUserId))
    /* yield forceUpdateRemoteState()*/
  })
}

const loseGame = function* (teamThatLost: t.Team) {
  yield put(afForfeit(teamThatLost))
  yield put(afStopTimer())
  /*yield forceUpdateRemoteState()*/
}

const zeroRemainingCards = (team: t.Team, cards: t.Card[]) => {
  const cardsForTeam = cards.filter(({team: t, flipped}) => t === team && !flipped);
  return cardsForTeam.length === 0;
}

const flipCard = function* () {
  yield takeEvery<any>(t.ActionType.FLIP_CARD, function* ({cardId}: t.FlipCard) {
    // Always flip the card, because that's a safe thing to do
    yield put(afSetCardFlipped(cardId))
    /* yield forceUpdateRemoteState()*/

    const state = yield select(R.identity)
    const cards: t.Card[] = R.view(cardsPath, state)
    const teamForCard = R.view(cardTeamByCardId(cardId), state)
    const currentTeam: t.Team = R.view(currentTeamPath, state)

    const correctCard = (currentTeam === teamForCard)
    const pickedAssassin = (teamForCard === ASSASSIN)
    const team1done = zeroRemainingCards(t.Team.TEAM_1, cards)
    const team2done = zeroRemainingCards(t.Team.TEAM_2, cards)

    if (pickedAssassin) {
      yield loseGame(currentTeam)
    } else if (team1done) {
      yield loseGame(t.Team.TEAM_2)
    } else if (team2done) {
      yield loseGame(t.Team.TEAM_1)
    } else if (correctCard) {
      // decrease the number of guesses if necessary
      const numGuesses: t.HintNumber = R.view(hintNumberPath, state)
      if (!(numGuesses === 'Infinity' || numGuesses === 'Zero')) {
        const asNumber = numGuesses - 1
        if (asNumber === 0) {
          yield put(afNextTurn())
          yield put(afStopTimer())
          /* yield forceUpdateRemoteState()*/
        } else {
          yield put(afUpdateHintNumber(asNumber))
          /* yield forceUpdateRemoteState()*/
        }
      }
    } else {
      yield put(afStopTimer())
      yield put(afNextTurn())
      /* yield forceUpdateRemoteState()*/
    }
  })
}

const nextTurn = function* () {
  yield takeEvery<any>(t.ActionType.NEXT_TURN, function* () {
    yield put(afStopTimer())
  })
}

const timer = function* () {
  yield takeEvery<any>(t.ActionType.START_TIMER, function* () {
    let wasStopped = false
    let seconds = 60
    yield put(afSetTime(seconds))
    for (; seconds >= 0; seconds--) {
      const { stopped } = yield race({
        stopped: take(t.ActionType.STOP_TIMER),
        tick: call(wait, 1000),
      })
      if (stopped) {
        wasStopped = true
        break
      } else {
        yield put(afSetTime(seconds))
        /* yield forceUpdateRemoteState()*/
      }
    }
    if (!wasStopped) {
      yield put(afNextTurn())
      /* yield forceUpdateRemoteState()*/
    }
  })
}

const joinGame = function* () {
  yield takeEvery<any>(t.ActionType.JOIN_GAME, function* ({userId, gameId}: t.JoinGame) {
    yield put(afJoinGameServer(userId, gameId))

    yield put(afBroadcastActionToUserId(userId, afSetGameId(gameId)))
    yield put(afBroadcastActionToUserId(userId, afSetPage(t.Page.GAME_MODE_PICK_TEAM)))
    yield pushGameState(gameId)
  })
}

const changeBackgroundColor = function* () {
  yield takeEvery<any>(t.ActionType.CHANGE_BACKGROUND_COLOR, function* ({gameId, team, backgroundColor}: t.ChangeBackgroundColor) {
    yield put(afChangeBackgroundColorServer(gameId, team, backgroundColor))
    yield pushGameState(gameId)
  })
}

const newGameSaga = function* () {
  yield takeEvery<any>(t.ActionType.NEW_GAME_2, function* ({userId}: t.NewGame2) {
    const gameId = uuid4()
    const gameState = newGame()
    yield put(afNewGameServer(gameId, gameState))

    const gameIds = yield select(R.compose(R.keys,R.view(gamesPath)))
    yield put(afBroadcastActionToAll(afSetGameIds(gameIds)))

    yield put(afJoinGame(gameId, userId))
  })
}

export default function* () {
  yield all([
    changeBackgroundColor(),
    joinGame(),
    newGameSaga(),
    userConnected(),
    userDisconnected(),
    nextTurn(),
    timer(),
    flipCard(),
  ])
}
