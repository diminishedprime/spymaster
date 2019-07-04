import * as sut from "./index";
import * as a from "./actions";
import * as io from "socket.io-client";

jest.mock("socket.io-client");

let store = sut.createStore();
let socketMock = jest.fn();
let ioMock: jest.Mocked<typeof io> = io as any;

beforeEach(() => {
  // Reset the store for each test.
  store = sut.createStore();

  ioMock.connect.mockReturnValue(socketMock as any);
});

describe("connectWebsocket", () => {
  test("sets the socket in state", () => {
    expect(store.getState().socket.isNone());

    store.dispatch(a.connectWebsocket("http://my-url.com"));

    expect(store.getState().socket.isSome());
  });
});
