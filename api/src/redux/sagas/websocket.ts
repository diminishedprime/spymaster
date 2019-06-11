import uuid4 from "uuid/v4";
import * as t from "../../types";
import R from "ramda";
import io from "socket.io";
import * as reduxSaga from "redux-saga";
import * as constants from "../../../../src/constants";
import * as paths from "../paths";
import * as actions from "../actions";
import * as effects from "redux-saga/effects";

const broadcastMessageToUserId = function* () {
  yield effects.takeEvery<any>(
    t.ServerAsyncActionType.BROADCAST_MESSAGE_TO_USER_ID,
    function* ({ userId, message }: t.BROADCAST_MESSAGE_TO_USER_IDAction) {
      const ws = yield effects.select(R.view(paths.wsByUserIdPath(userId)));
      ws.emit(constants.MESSAGE, message);
    }
  );
};
const broadcastMessageToUserIds = function* () {
  yield effects.takeEvery<any>(
    t.ServerAsyncActionType.BROADCAST_MESSAGE_TO_USER_IDS,
    function* ({ userIds, message }: t.BROADCAST_MESSAGE_TO_USER_IDSAction) {
      for (let i = 0; i < userIds.length; i++) {
        const userId = userIds[i];
        const ws = yield effects.select(R.view(paths.wsByUserIdPath(userId)));
        ws.emit(constants.MESSAGE, message);
      }
    }
  );
};
const broadcastMessageToAll = function* () {
  yield effects.takeEvery<any>(
    t.ServerAsyncActionType.BROADCAST_MESSAGE_TO_ALL,
    function* ({ message }: t.BROADCAST_MESSAGE_TO_ALLAction) {
      const userIds = yield effects.select(
        R.compose(
          R.keys,
          R.view(paths.usersPath)
        )
      );
      for (let i = 0; i < userIds.length; i++) {
        const userId = userIds[i];
        const ws = yield effects.select(R.view(paths.wsByUserIdPath(userId)));
        ws.emit(constants.MESSAGE, message);
      }
    }
  );
};
const broadcastActionToUserId = function* () {
  yield effects.takeEvery<any>(
    t.ServerAsyncActionType.BROADCAST_ACTION_TO_USER_ID,
    function* ({ userId, action }: t.BROADCAST_ACTION_TO_USER_IDAction) {
      const ws = yield effects.select(R.view(paths.wsByUserIdPath(userId)));
      ws.emit(constants.ACTION, action);
    }
  );
};
const broadcastActionToUserIds = function* () {
  yield effects.takeEvery<any>(
    t.ServerAsyncActionType.BROADCAST_ACTION_TO_USER_IDS,
    function* ({ userIds, action }: t.BROADCAST_ACTION_TO_USER_IDSAction) {
      for (let i = 0; i < userIds.length; i++) {
        const userId = userIds[i];
        const ws = yield effects.select(R.view(paths.wsByUserIdPath(userId)));
        ws.emit(constants.ACTION, action);
      }
    }
  );
};
const broadcastActionToAll = function* () {
  yield effects.takeEvery<any>(
    t.ServerAsyncActionType.BROADCAST_ACTION_TO_ALL,
    function* ({ action }: t.BROADCAST_ACTION_TO_ALLAction) {
      const userIds = yield effects.select(
        R.compose(
          R.keys,
          R.view(paths.usersPath)
        )
      );
      for (let i = 0; i < userIds.length; i++) {
        const userId = userIds[i];
        const ws = yield effects.select(R.view(paths.wsByUserIdPath(userId)));
        ws.emit(constants.ACTION, action);
      }
    }
  );
};

const onDisconnect = function* (wsChan: any) {
  const userId = yield effects.take(wsChan);
  yield effects.put(actions.afUserDisconnected(userId));
};

const onClientAction = function* (wsChan: any) {
  let action;
  while ((action = yield effects.take(wsChan))) {
    yield effects.put(action);
  }
};

const connectWS = function* (ws: any) {
  // eslint-disable-next-line
  const userId = uuid4();

  const clientActionChan = reduxSaga.eventChannel(emitter => {
    ws.on("client action", emitter);
    // eslint-disable-next-line no-console
    return () => console.log("something unsubscribe socket");
  });

  const disconnectChan = reduxSaga.eventChannel(emitter => {
    ws.on("disconnect", () => emitter(userId));
    // eslint-disable-next-line no-console
    return () => console.log("something unsubscribe socket");
  });

  yield effects.put(actions.afAddUser(userId, ws));
  yield effects.put(
    actions.afBroadcastMessageToUserId(userId, "thanks for connecting via websockets")
  );
  yield effects.put(actions.afUserConnected(userId));
  yield effects.fork(onClientAction, clientActionChan);
  yield onDisconnect(disconnectChan);
};

const connectWSS = function* () {
  const { httpServer } = yield effects.take(
    t.ServerAsyncActionType.CONNECT_WEBSOCKET_SERVER
  );
  const wss = io(httpServer);
  const wssConnectionChan = reduxSaga.eventChannel(emitter => {
    wss.on("connection", ws => emitter(ws));
    // eslint-disable-next-line no-console
    return () => console.log("something unsubscribe from wss emitter?");
  });
  let ws;
  while ((ws = yield effects.take(wssConnectionChan))) {
    yield effects.fork(connectWS, ws);
  }
};

const websocket = function* () {
  yield effects.all([
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
