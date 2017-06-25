import R from 'ramda'

// Paths & Initial State
const localState = ['localState']
const remoteState = ['remoteState']
const playerType = [...localState, 'playerType']
const role = [...playerType, 'role']
const team = [...playerType, 'team']
const gameMode = [...localState, 'gameMode']
const cards = [...remoteState, 'cards']
const cardsId = (id) => [...cards, id]
const cardsFlipped = (id) => [...cardsId(id), 'flipped']
const cardsTeam = (id) => [...cardsId(id), 'team']
const time = [...remoteState, 'time']
const error = [...localState, 'error']
const errorText = [...error, 'text']
const errorSeverity = [...error, 'severity']
const settings = [...localState, 'settings']
const showTitle = [...settings, 'showTitle']
const colors = [...remoteState, 'colors']
const colorsTeam = (team) => [...colors, team]
const colorsTeamBackgroundColor = (team) => [...colorsTeam(team), 'backgroundColor']
const currentTeam = [...remoteState, 'currentTeam']
const ws = [...localState, 'ws']
const username = [...localState, 'username']
const editing = [...localState, 'editing']
const userList = [...remoteState, 'users']
const userListUser = (idx) => [...userList, idx]
const users = [...localState, 'users']
const usersUser = (idx) => [...users, idx]
const usersUserUsername = (idx) => [...usersUser(idx), 'userId']
const hint = [...remoteState, 'hint']
const hintText = [...hint, 'text']
const hintNumber = [...hint, 'number']
const hintSubmitted = [...hint, 'submitted']
const winner = [...remoteState, 'winner']
const score = [...remoteState, 'score']

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
export const gameModePath = R.lensPath([...gameMode])
export const cardsPath = R.lensPath([...cards])
export const colorsPath = R.lensPath([...colors])
export const colorsTeamPath = (team) => R.lensPath(colorsTeam(team))
export const backgroundColorPath = (team) => R.lensPath([...colorsTeamBackgroundColor(team)])
export const currentTeamPath = R.lensPath([...currentTeam])
export const cardsIdPath = (id) => R.lensPath(cardsId(id))
export const cardsTeamPath = (id) => R.lensPath(cardsTeam(id))
export const cardsFlippedPath = (id) => R.lensPath(cardsFlipped(id))
export const wsPath = R.lensPath([...ws])
export const usernamePath = R.lensPath([...username])
export const editingPath = R.lensPath([...editing])
export const userListPath = R.lensPath([...userList])
export const userListUserPath = (idx) => R.lensPath([...userListUser(idx)])
export const usersPath = R.lensPath([...users])
export const usersUserPath = (idx) => R.lensPath([...usersUser(idx)])
export const usersUserUsernamePath = (idx) => R.lensPath([...usersUserUsername(idx)])
