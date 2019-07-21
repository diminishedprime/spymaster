import * as sut from "./index";
import * as lens from "./lens";
import * as a from "./actions";
import * as ca from "../../../src/redux/actions";
import * as t from "../types";
import io from "socket.io";
import transit from "../../../src/transit";
import * as i from "immutable";
import * as ta from "typesafe-actions";

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
    if (eventType === "disconnect") {
      cbs.disconnect = cb;
    }
  };
  const emit = jest.fn((t, v) => {
    if (t === "action") {
      const value = transit.fromJSON(v);
      if (ta.isActionOf(ca.setPlayerId)(value)) {
        cbs.playerId = value.payload.id;
      }
    }
  });
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
  disconnect: (reason: string) => void;
  emit: jest.Mock;
  playerId: string;
}

const addFakeClient = (
  gameId?: t.GameId,
  team?: t.Team.Team1 | t.Team.Team2,
  role?: t.Role
): FakeClient => {
  const client1Cbs: any = {};
  onSocket(createClientFake(client1Cbs));
  if (gameId !== undefined) {
    (client1Cbs as FakeClient).sendAction(ca.joinGame(gameId));
    if (team !== undefined) {
      (client1Cbs as FakeClient).sendAction(ca.requestTeam(gameId, team));
      if (role !== undefined) {
        (client1Cbs as FakeClient).sendAction(ca.requestRole(gameId, role));
      }
    }
  }
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

describe("generateCards", () => {
  let cards: t.Cards;
  beforeEach(() => {
    cards = sut.generateCards(t.Team.Team1);
  });

  test("generates right number of cards", () => {
    expect(cards.size).toEqual(25);
  });

  test("generates right number for each team", () => {
    expect(cards.filter(card => card.team === t.Team.Team1).size).toBe(9);
    expect(cards.filter(card => card.team === t.Team.Team2).size).toBe(8);
    expect(cards.filter(card => card.team === t.Team.Bystander).size).toBe(7);
    expect(cards.filter(card => card.team === t.Team.Assassin).size).toBe(1);
  });
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

  describe("With all necessary clients", () => {
    let team1Spymaster: FakeClient;
    let team2Spymaster: FakeClient;
    let team1Guesser: FakeClient;
    let team2Guesser: FakeClient;
    let gameId: t.GameId;
    let game: t.Game;

    beforeEach(() => {
      team1Spymaster = addFakeClient();
      team1Spymaster.sendAction(ca.newGame());
      gameId = store
        .getState()
        .games.keySeq()
        .toArray()[0];
      team1Spymaster.sendAction(ca.joinGame(gameId));
      team1Spymaster.sendAction(ca.requestTeam(gameId, t.Team.Team1));
      team1Spymaster.sendAction(ca.requestRole(gameId, t.Role.Spymaster));

      team2Spymaster = addFakeClient(gameId, t.Team.Team2, t.Role.Spymaster);
      team1Guesser = addFakeClient(gameId, t.Team.Team1, t.Role.Guesser);
      team2Guesser = addFakeClient(gameId, t.Team.Team2, t.Role.Guesser);

      game = store.getState().games.get(gameId)!;
    });

    test("hasNecessaryPlayers is true", () => {
      const hasNecessaryPlayers = t
        .fromNullable(store.getState().games.get(gameId))
        .map(g => g.hasNecessaryPlayers);

      expect(hasNecessaryPlayers.isSome()).toBeTruthy();
      expect(
        hasNecessaryPlayers.isSome() && hasNecessaryPlayers.value
      ).toBeTruthy();
    });

    test("can start game", () => {
      team1Spymaster.sendAction(ca.startGame(gameId));

      expect(
        store
          .getState()
          .games.get(gameId)!
          .cards.isSome()
      ).toBeTruthy();

      expect(store.getState().games.get(gameId)!.started).toBeTruthy();
    });

    describe("and started game", () => {
      beforeEach(() => {
        team1Spymaster.sendAction(ca.startGame(gameId));
      });

      test("Sets currentTeam", () => {
        const maybeCurrentTeam = store.getState().games.get(gameId)!
          .currentTeam;
        expect(maybeCurrentTeam.isSome()).toBeTruthy();
      });

      test("First spymaster can set hint.", () => {
        const maybeCurrentTeam = store.getState().games.get(gameId)!
          .currentTeam;
        expect(maybeCurrentTeam.isSome()).toBeTruthy();
        if (maybeCurrentTeam.isSome()) {
          const currentTeam = maybeCurrentTeam.value;
          const expectedHint = "MyHint";
          const firstSpymaster =
            currentTeam === t.Team.Team1 ? team1Spymaster : team2Spymaster;
          firstSpymaster.sendAction(ca.setHint(gameId, expectedHint));

          const actualHint = store.getState().games.get(gameId)!.hint;

          expect(actualHint.isSome()).toBeTruthy();
          if (actualHint.isSome()) {
            expect(actualHint.value === expectedHint).toBeTruthy();
          }
        }
      });
    });
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

    test("Client can be removed", () => {
      expect(store.getState().users.get(clientId)).toBeTruthy();

      client.disconnect("cause");

      expect(store.getState().users.get(clientId)).toBeFalsy();
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

          const actualTeam = lens
            .player(gameId, clientId)
            .get(store.getState())
            .chain(p => p.team);

          expect(actualTeam).toEqual(t.some(t.Team.Team1));
          const emitMockCalls = client.emit.mock.calls;
          expect(emitMockCalls[emitMockCalls.length - 1][1]).toEqual(
            transit.toJSON(ca.setGame(store.getState().games.get(gameId)!))
          );
        });
        describe("and requesting a team", () => {
          beforeEach(() => {
            client.sendAction(ca.requestTeam(gameId, t.Team.Team1));
          });

          describe("and requesting a role", () => {
            beforeEach(() => {
              client.sendAction(ca.requestRole(gameId, t.Role.Spymaster));
            });

            test("is removed from game if disconnects", () => {
              client.disconnect("cause I wanna");

              expect(store.getState().games.get(gameId)!.players).toEqual(
                i.Map()
              );
            });

            test("resets role when changing teams", () => {
              client.sendAction(ca.requestTeam(gameId, t.Team.Team2));

              expect(
                store
                  .getState()
                  .games.get(gameId)!
                  .players.get(client.playerId)!.role
              ).toEqual(t.none);
            });
          });

          test("Can request a role that is available", () => {
            expect(
              store
                .getState()
                .games.get(gameId)!
                .players.get(clientId)!.role
            ).toEqual(t.none);

            client.sendAction(ca.requestRole(gameId, t.Role.Spymaster));

            expect(
              store
                .getState()
                .games.get(gameId)!
                .players.get(clientId)!.role
            ).toEqual(t.some(t.Role.Spymaster));
          });

          test("Cant request Spymaster once taken", () => {
            const secondClient = addFakeClient(gameId, t.Team.Team1);

            client.sendAction(ca.requestRole(gameId, t.Role.Spymaster));
            secondClient.sendAction(ca.requestRole(gameId, t.Role.Spymaster));

            expect(
              store
                .getState()
                .games.get(gameId)!
                .players.get(secondClient.playerId)!.role
            ).toEqual(t.none);
          });
        });
      });
    });
  });
});
