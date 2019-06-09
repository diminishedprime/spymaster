import uuid4 from "uuid/v4";
import * as t from "../../types";
import R from "ramda";
import io from "socket.io";
import { eventChannel } from "redux-saga";

import { MESSAGE, ACTION } from "../../../../src/constants";
import { wsByUserIdPath, usersPath } from "../paths";
import {
  afBroadcastMessageToUserId,
  afAddUser,
  afUserDisconnected,
  afUserConnected
} from "../actions";

import { fork, put, take, all, select, takeEvery } from "redux-saga/effects";

const broadcastMessageToUserId = function*() {
  yield takeEvery<any>(
    t.ServerAsyncActionType.BROADCAST_MESSAGE_TO_USER_ID,
    function*({ userId, message }: t.BROADCAST_MESSAGE_TO_USER_IDAction) {
      const ws = yield select(R.view(wsByUserIdPath(userId)));
      ws.emit(MESSAGE, message);
    }
  );
};
const broadcastMessageToUserIds = function*() {
  yield takeEvery<any>(
    t.ServerAsyncActionType.BROADCAST_MESSAGE_TO_USER_IDS,
    function*({ userIds, message }: t.BROADCAST_MESSAGE_TO_USER_IDSAction) {
      for (let i = 0; i < userIds.length; i++) {
        const userId = userIds[i];
        const ws = yield select(R.view(wsByUserIdPath(userId)));
        ws.emit(MESSAGE, message);
      }
    }
  );
};
const broadcastMessageToAll = function*() {
  yield takeEvery<any>(
    t.ServerAsyncActionType.BROADCAST_MESSAGE_TO_ALL,
    function*({ message }: t.BROADCAST_MESSAGE_TO_ALLAction) {
      const userIds = yield select(
        R.compose(
          R.keys,
          R.view(usersPath)
        )
      );
      for (let i = 0; i < userIds.length; i++) {
        const userId = userIds[i];
        const ws = yield select(R.view(wsByUserIdPath(userId)));
        ws.emit(MESSAGE, message);
      }
    }
  );
};
const broadcastActionToUserId = function*() {
  yield takeEvery<any>(
    t.ServerAsyncActionType.BROADCAST_ACTION_TO_USER_ID,
    function*({ userId, action }: t.BROADCAST_ACTION_TO_USER_IDAction) {
      const ws = yield select(R.view(wsByUserIdPath(userId)));
      ws.emit(ACTION, action);
    }
  );
};
const broadcastActionToUserIds = function*() {
  yield takeEvery<any>(
    t.ServerAsyncActionType.BROADCAST_ACTION_TO_USER_IDS,
    function*({ userIds, action }: t.BROADCAST_ACTION_TO_USER_IDSAction) {
      for (let i = 0; i < userIds.length; i++) {
        const userId = userIds[i];
        const ws = yield select(R.view(wsByUserIdPath(userId)));
        ws.emit(ACTION, action);
      }
    }
  );
};
const broadcastActionToAll = function*() {
  yield takeEvery<any>(
    t.ServerAsyncActionType.BROADCAST_ACTION_TO_ALL,
    function*({ action }: t.BROADCAST_ACTION_TO_ALLAction) {
      const userIds = yield select(
        R.compose(
          R.keys,
          R.view(usersPath)
        )
      );
      for (let i = 0; i < userIds.length; i++) {
        const userId = userIds[i];
        const ws = yield select(R.view(wsByUserIdPath(userId)));
        ws.emit(ACTION, action);
      }
    }
  );
};

const onDisconnect = function*(wsChan: any) {
  const userId = yield take(wsChan);
  yield put(afUserDisconnected(userId));
};

const onClientAction = function*(wsChan: any) {
  let action;
  while ((action = yield take(wsChan))) {
    yield put(action);
  }
};

const connectWS = function*(ws: any) {
  // eslint-disable-next-line
  const userId = uuid4();

  const clientActionChan = eventChannel(emitter => {
    ws.on("client action", emitter);
    // eslint-disable-next-line no-console
    return () => console.log("something unsubscribe socket");
  });

  const disconnectChan = eventChannel(emitter => {
    ws.on("disconnect", () => emitter(userId));
    // eslint-disable-next-line no-console
    return () => console.log("something unsubscribe socket");
  });

  yield put(afAddUser(userId, ws));
  yield put(
    afBroadcastMessageToUserId(userId, "thanks for connecting via websockets")
  );
  yield put(afUserConnected(userId));
  yield fork(onClientAction, clientActionChan);
  yield onDisconnect(disconnectChan);
};

const connectWSS = function*() {
  const { httpServer } = yield take(
    t.ServerAsyncActionType.CONNECT_WEBSOCKET_SERVER
  );
  const wss = io(httpServer);
  const wssConnectionChan = eventChannel(emitter => {
    wss.on("connection", ws => emitter(ws));
    // eslint-disable-next-line no-console
    return () => console.log("something unsubscribe from wss emitter?");
  });
  let ws;
  while ((ws = yield take(wssConnectionChan))) {
    yield fork(connectWS, ws);
  }
};

const websocket = function*() {
  yield all([
    broadcastMessageToUserIds(),
    broadcastMessageToUserId(),
    broadcastMessageToAll(),
    broadcastActionToUserIds(),
    broadcastActionToUserId(),
    broadcastActionToAll(),
    connectWSS()
  ]);
};

export default websocket;
