import R from 'ramda'

const localStateA = ['localState']
const usersA = [...localStateA, 'users']
const gamesA = [...localStateA, 'games']
const gameByGameIdA = (gameId) => [...gamesA, gameId]
const userByUserIdA = (userId) => [...usersA, userId]
const wsByUserIdA = (userId) => [...userByUserIdA(userId), 'ws']
const cardsA = ['cards']
const gameUsersA = ['users']
const hintA = ['hint']
const hintTextA = [...hintA, 'text']
const hintNumberA = [...hintA, 'number']
const hintSubmittedA = [...hintA, 'submitted']
const styleA = ['style']
const styleForTeamA = (team) => [...styleA, team]
const foregroundColorForTeamA = (team) =>
  [...styleForTeamA(team), 'color']
const backgroundColorForTeamA = (team) =>
  [...styleForTeamA(team), 'backgroundColor']

export const usersPath = R.lensPath(usersA)
export const gamesPath = R.lensPath(gamesA)
export const gameByGameIdPath = (gameId) => R.lensPath(gameByGameIdA(gameId))
export const userByUserIdPath = (userId) => R.lensPath(userByUserIdA(userId))
export const wsByUserIdPath = (userId) => R.lensPath(wsByUserIdA(userId))
export const cardsPath = R.lensPath(cardsA)
export const gameUsersPath = R.lensPath(gameUsersA)
export const hintPath = R.lensPath(hintA)
export const hintTextPath = R.lensPath(hintTextA)
export const hintNumberPath = R.lensPath(hintNumberA)
export const hintSubmittedPath = R.lensPath(hintSubmittedA)
export const styleForTeamPath = (team) => R.lensPath(styleForTeamA(team))
export const foregroundColorForTeamPath = (team) =>
  R.lensPath(foregroundColorForTeamA(team))
export const backgroundColorForTeamPath = (team) =>
  R.lensPath(backgroundColorForTeamA(team))
