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

export const readyToStart = (game: t.Game): boolean => {
  let team1Spymaster = false;
  let team2Spymaster = false;
  let team1Guesser = false;
  let team2Guesser = false;
  for (const player of game.players.valueSeq().toArray()) {
    if (player.role.isSome() && player.team.isSome()) {
      if (player.role.value === t.Role.Spymaster) {
        if (player.team.value === t.Team.Team1) {
          team1Spymaster = true;
        } else if (player.team.value === t.Team.Team2) {
          team2Spymaster = true;
        }
      } else if (player.role.value === t.Role.Guesser) {
        if (player.team.value === t.Team.Team1) {
          team1Guesser = true;
        } else if (player.team.value === t.Team.Team2) {
          team2Guesser = true;
        }
      }
    }
  }
  return team1Spymaster && team1Guesser && team2Guesser && team2Spymaster;
};
