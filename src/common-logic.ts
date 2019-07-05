import * as t from "./types";

export const canHaveRole = (
  team: t.PlayerTeam,
  role: t.Role,
  game: t.Game
): boolean => {
  const alreadyThat = game.players.filter(
    p =>
      p.team.isSome() &&
      p.team.value === team &&
      p.role.isSome() &&
      p.role.value === role
  ).size;
  if (role === t.Role.Spymaster) {
    return alreadyThat === 0;
  } else {
    return true;
  }
};
