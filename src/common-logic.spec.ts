import * as sut from "./common-logic";
import * as t from "./types";
import * as i from "immutable";

describe("canHaveRole", () => {
  let game: t.Game = { id: "123", players: i.Map() };

  beforeEach(() => {
    game = { id: "123", players: i.Map() };
  });

  describe("with no existing players", () => {
    test("1 - spy : yes", () => {
      expect(
        sut.canHaveRole(t.Team.Team1, t.Role.Spymaster, game)
      ).toBeTruthy();
    });
    test("2 - spy : yes", () => {
      expect(
        sut.canHaveRole(t.Team.Team2, t.Role.Spymaster, game)
      ).toBeTruthy();
    });
    test("1 - guesser : yes", () => {
      expect(sut.canHaveRole(t.Team.Team1, t.Role.Guesser, game)).toBeTruthy();
    });
    test("2 - guesser : yes", () => {
      expect(sut.canHaveRole(t.Team.Team2, t.Role.Guesser, game)).toBeTruthy();
    });
  });

  describe("with one of each", () => {
    beforeEach(() => {
      const players: t.Players = i.Map({
        a: {
          id: "a",
          alias: t.none,
          team: t.some(t.Team.Team1),
          role: t.some(t.Role.Spymaster)
        },
        b: {
          id: "b",
          alias: t.none,
          team: t.some(t.Team.Team2),
          role: t.some(t.Role.Spymaster)
        },
        c: {
          id: "c",
          alias: t.none,
          team: t.some(t.Team.Team1),
          role: t.some(t.Role.Guesser)
        },
        d: {
          id: "d",
          alias: t.none,
          team: t.some(t.Team.Team2),
          role: t.some(t.Role.Guesser)
        }
      });
      game.players = players;
    });

    test("1 - spy : no", () => {
      expect(sut.canHaveRole(t.Team.Team1, t.Role.Spymaster, game)).toBeFalsy();
    });
    test("2 - spy : no", () => {
      expect(sut.canHaveRole(t.Team.Team2, t.Role.Spymaster, game)).toBeFalsy();
    });
    test("1 - guesser : yes", () => {
      expect(sut.canHaveRole(t.Team.Team1, t.Role.Guesser, game)).toBeTruthy();
    });
    test("2 - guesser : yes", () => {
      expect(sut.canHaveRole(t.Team.Team2, t.Role.Guesser, game)).toBeTruthy();
    });
  });
});

describe("readyToStart", () => {
  let game: t.Game = { id: "123", players: i.Map() };

  beforeEach(() => {
    game = { id: "123", players: i.Map() };
  });

  test("with no teams or roles set is false", () => {
    game.players = i.Map();

    expect(sut.readyToStart(game)).toBeFalsy();
  });

  test("with all teams & roles set is true", () => {
    game.players = i.Map({
      a: {
        id: "a",
        alias: t.none,
        team: t.some(t.Team.Team1),
        role: t.some(t.Role.Spymaster)
      },
      b: {
        id: "b",
        alias: t.none,
        team: t.some(t.Team.Team2),
        role: t.some(t.Role.Spymaster)
      },
      c: {
        id: "c",
        alias: t.none,
        team: t.some(t.Team.Team1),
        role: t.some(t.Role.Guesser)
      },
      d: {
        id: "d",
        alias: t.none,
        team: t.some(t.Team.Team2),
        role: t.some(t.Role.Guesser)
      }
    });

    expect(sut.readyToStart(game)).toBeTruthy();
  });
});
