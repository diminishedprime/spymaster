import * as sut from "./index";
import * as a from "./actions";
import * as ca from "../../../src/redux/actions";
import * as t from "../types";
import io from "socket.io";
import transit from "../../../src/transit";
import * as i from "immutable";

jest.mock("socket.io");

let store = sut.createStore();
let ioMock: jest.Mock<typeof io> = io as any;
let server = {};
let onSocket = (_: any) => {};
let errorMock = jest.fn();
let logMock = jest.fn();

// TODO - this is really confusing, but it works for now.
let createClientFake = (cbs: any): any => {
  const on = (eventType: string, cb: any) => {
    if (eventType === "client action") {
      cbs.sendAction = (thing: any) => cb(transit.toJSON(thing));
    }
  };
  const emit = jest.fn();
  cbs.emit = emit;

  return {
    on,
    emit
  } as any;
};

let createServerFake = (): io.Server => {
  const on = (eventType: string, cb: (socket: any) => void) => {
    if (eventType === "connection") {
      onSocket = cb;
    }
  };
  return {
    on
  } as any;
};

interface FakeClient {
  sendAction: (action: t.ClientRootAction) => void;
  emit: jest.Mock;
}

const addFakeClient = (): FakeClient => {
  const client1Cbs: any = {};
  onSocket(createClientFake(client1Cbs));
  return client1Cbs;
};

beforeEach(() => {
  // Reset the store for each test.
  store = sut.createStore();
  const serverFake = createServerFake();
  ioMock.mockReturnValue(serverFake as never);
  window.console.error = errorMock;
  window.console.log = logMock;
});

describe("After setting up the server", () => {
  beforeEach(() => {
    store.dispatch(a.connectWebsocket(server as any));
  });

  test("Fake can add a single client", () => {
    expect(store.getState().users).toEqual(i.Map());

    addFakeClient();

    expect(
      store
        .getState()
        .users.keySeq()
        .toArray().length
    ).toEqual(1);
  });

  test("Fake can add multiple clients", () => {
    expect(store.getState().users).toEqual(i.Map());

    addFakeClient();
    addFakeClient();

    const clients = store
      .getState()
      .users.keySeq()
      .toArray();

    expect(clients.length).toEqual(2);
    expect(clients[0]).not.toEqual(clients[1]);
  });

  describe("With a client", () => {
    let client: FakeClient;
    let clientId: string;

    beforeEach(() => {
      client = addFakeClient();
      client.emit.mockClear();
      clientId = store
        .getState()
        .users.keySeq()
        .toArray()[0];
    });

    test("newGame creates a new game", () => {
      expect(store.getState().games).toEqual(i.Map());

      client.sendAction(ca.newGame());

      expect(
        store
          .getState()
          .games.keySeq()
          .toArray().length
      ).toEqual(1);
    });

    describe("and a new game", () => {
      let gameId: string;
      beforeEach(() => {
        client.sendAction(ca.newGame());
        gameId = store
          .getState()
          .games.keySeq()
          .toArray()[0];
      });
      test("can join existing game", () => {
        expect(
          store
            .getState()
            .games.get(gameId)!
            .players.keySeq()
            .toArray().length
        ).toEqual(0);

        client.sendAction(ca.joinGame(gameId));

        expect(
          store
            .getState()
            .games.get(gameId)!
            .players.keySeq()
            .toArray().length
        ).toEqual(1);
      });

      describe("and joining that game", () => {
        beforeEach(() => {
          client.sendAction(ca.joinGame(gameId));
        });

        test("Can request a team", () => {
          client.sendAction(ca.requestTeam(gameId, t.Team.Team1));

          const actualTeam = sut.lens
            .player(gameId, clientId)
            .get(store.getState())
            .map(p => p.team);

          expect(actualTeam).toEqual(t.some(t.Team.Team1));
          const emitMockCalls = client.emit.mock.calls;
          expect(emitMockCalls[emitMockCalls.length - 1][1]).toEqual(
            transit.toJSON(ca.setGame(store.getState().games.get(gameId)!))
          );
        });
      });
    });
  });
});
