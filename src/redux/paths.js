import R from 'ramda'

// Paths & Initial State
const localState = ['localState']
const remoteState = ['remoteState']
const playerType = [...localState, 'playerType']
const role = [...playerType, 'role']
const team = [...playerType, 'team']
const cards = [...remoteState, 'cards']
const cardByCardIdA = (cardId) => [...cards, cardId]
const cardFlippedByCardIdA = (cardId) => [...cardByCardIdA(cardId), 'flipped']
const cardTeamByCardIdA = (cardId) => [...cardByCardIdA(cardId), 'team']
const cardTextByCardIdA = (cardId) => [...cardByCardIdA(cardId), 'text']
const time = [...remoteState, 'time']
const error = [...localState, 'error']
const errorText = [...error, 'text']
const errorSeverity = [...error, 'severity']
const settings = [...localState, 'settings']
const showTitle = [...settings, 'showTitle']
const styleA = [...remoteState, 'style']
const styleForTeamA = (team) => [...styleA, team]
const foregroundColorForTeamA = (team) =>
  [...styleForTeamA(team), 'color']
const backgroundColorForTeamA = (team) =>
  [...styleForTeamA(team), 'backgroundColor']


const currentTeam = [...remoteState, 'currentTeam']
const ws = [...localState, 'ws']
const userIdA = [...localState, 'userId']
const username = [...localState, 'username']
const editing = [...localState, 'editing']
const pageA = [...localState, 'page']

const clientUsers = [...remoteState, 'clientUsers']

const hint = [...remoteState, 'hint']
const hintText = [...hint, 'text']
const hintNumber = [...hint, 'number']
const hintSubmitted = [...hint, 'submitted']
const winner = [...remoteState, 'winner']
const score = [...remoteState, 'score']
const gameIds = [...localState, 'gameIds']
const gameIdA = [...localState, 'gameId']
const serverAddress = [...localState, 'serverAddress']
const connected = [...localState, 'connected']

export const gameIdPath = R.lensPath(gameIdA)
export const userIdPath = R.lensPath(userIdA)
export const scorePath = R.lensPath([...score])
export const winnerPath = R.lensPath([...winner])
export const hintPath = R.lensPath([...hint])
export const hintSubmittedPath = R.lensPath([...hintSubmitted])
export const hintTextPath = R.lensPath([...hintText])
export const hintNumberPath = R.lensPath([...hintNumber])
export const remoteStatePath = R.lensPath([...remoteState])
export const settingsPath = R.lensPath([...settings])
export const timePath = R.lensPath([...time])
export const errorPath = R.lensPath([...error])
export const errorTextPath = R.lensPath([...errorText])
export const errorSeverityPath = R.lensPath([...errorSeverity])
export const showTitlePath = R.lensPath([...showTitle])
export const playerTypePath = R.lensPath([...playerType])
export const rolePath = R.lensPath([...role])
export const teamPath = R.lensPath([...team])
export const cardsPath = R.lensPath([...cards])
export const currentTeamPath = R.lensPath([...currentTeam])
export const cardByCardId = (cardId) =>
  R.lensPath(cardByCardIdA(cardId))
export const cardTeamByCardId = (cardId) =>
  R.lensPath(cardTeamByCardIdA(cardId))
export const cardFlippedByCardId = (cardId) =>
  R.lensPath(cardFlippedByCardIdA(cardId))
export const cardTextByCardId = (cardId) =>
  R.lensPath(cardTextByCardIdA(cardId))
export const wsPath = R.lensPath([...ws])
export const usernamePath = R.lensPath([...username])
export const editingPath = R.lensPath([...editing])
export const clientUsersPath = R.lensPath(clientUsers)
export const page = R.lensPath(pageA)

export const styleForTeamPath = (team) => R.lensPath(styleForTeamA(team))
export const foregroundColorForTeamPath = (team) =>
  R.lensPath(foregroundColorForTeamA(team))
export const backgroundColorForTeamPath = (team) =>
  R.lensPath(backgroundColorForTeamA(team))
export const gameIdsPath = R.lensPath(gameIds)
export const serverAddressPath = R.lensPath(serverAddress)
export const connectedPath = R.lensPath(connected)
