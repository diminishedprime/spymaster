import * as sut from "./index";
import * as a from "./actions";
import * as io from "socket.io-client";
import * as t from "../types";
import * as i from "immutable";
import transit from "../transit";

jest.mock("socket.io-client");

const resetSocketMock = () => {
  return { emit: jest.fn(), on: jest.fn() };
};

let store = sut.createStore();
let socketMock = resetSocketMock();
let ioMock: jest.Mocked<typeof io> = io as any;
let errorMock = jest.fn();
let logMock = jest.fn();

beforeEach(() => {
  // Reset the store for each test.
  store = sut.createStore();

  socketMock = resetSocketMock();
  errorMock = jest.fn();
  logMock = jest.fn();
  ioMock.connect.mockReturnValue(socketMock as any);

  window.console.error = errorMock;
  window.console.log = logMock;
});

test("sending actions with no socket set logs and error", () => {
  store.dispatch(a.newGame());

  expect(errorMock.mock.calls[0][0]).toBe("No socket connected.");
});

describe("For the action: ", () => {
  describe("connectWebsocket", () => {
    test("socket is set to a Some value", () => {
      expect(store.getState().socket.isNone());

      store.dispatch(a.connectWebsocket("http://my-url.com"));

      expect(store.getState().socket.isSome());
    });
  });

  describe("setPage", () => {
    test("The page is set", () => {
      expect(store.getState().page === t.Page.Lobby);

      store.dispatch(a.setPage(t.Page.Game));

      expect(store.getState().page === t.Page.Game);
    });
  });

  describe("setGame", () => {
    test("The Game is set", () => {
      expect(store.getState().game.isNone());

      store.dispatch(a.setGame({ id: "123", players: i.Map() }));

      expect(store.getState().game.isSome());
      expect(store.getState().game.map(g => g.id)).toEqual(t.some("123"));
    });
  });

  describe("newGame", () => {
    test("Sends newGame action to the server", () => {
      store.dispatch(a.connectWebsocket("http://my-url.com"));

      store.dispatch(a.newGame());

      expect(socketMock.emit.mock.calls[0][1]).toEqual(
        transit.toJSON(a.newGame())
      );
    });
  });

  describe("joinGame", () => {
    test("Sends joinGame action to the server", () => {
      store.dispatch(a.connectWebsocket("http://my-url.com"));

      store.dispatch(a.joinGame("123"));

      expect(socketMock.emit.mock.calls[0][1]).toEqual(
        transit.toJSON(a.joinGame("123"))
      );
    });
  });

  describe("noOp", () => {
    test("does nothing", () => {
      const stateBefore = store.getState();

      store.dispatch(a.noOp());

      expect(stateBefore).toEqual(store.getState());
    });
  });

  describe("setGameIds", () => {
    test("sets the game ids", () => {
      expect(store.getState().gameIds).toEqual([]);

      store.dispatch(a.setGameIds(["123", "456"]));

      expect(store.getState().gameIds).toEqual(["123", "456"]);
    });
  });
});
