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
const time = [...remoteState, 'time']
const error = [...localState, 'error']
const errorText = [...error, 'text']
const errorSeverity = [...error, 'severity']
const actionLog = [...localState, 'actionLog']
const replaying = [...localState, 'replaying']
const settings = [...localState, 'settings']
const showTitle = [...settings, 'showTitle']
const colors = [...remoteState, 'colors']
const colorsTeam = (team) =>
  [...colors, team]
const colorsTeamBackgroundColor = (team) =>
  [...colorsTeam(team), 'backgroundColor']
const currentTeam = [...remoteState, 'currentTeam']
const ws = [...localState, 'ws']
const username = [...localState, 'username']
const editing = [...localState, 'editing']
const userList = [...remoteState, 'users']
const userListUser = (idx) => [...userList, idx]
const users = [...localState, 'users']
const usersUser = (idx) => [...users, idx]
const usersUserUsername = (idx) => [...usersUser(idx), 'userId']

const remoteStatePath = R.lensPath([...remoteState])
const settingsPath = R.lensPath([...settings])
const timePath = R.lensPath([...time])
const errorPath = R.lensPath([...error])
const errorTextPath = R.lensPath([...errorText])
const errorSeverityPath = R.lensPath([...errorSeverity])
const actionLogPath = R.lensPath([...actionLog])
const replayingPath = R.lensPath([...replaying])
const showTitlePath = R.lensPath([...showTitle])
const playerTypePath = R.lensPath([...playerType])
const rolePath = R.lensPath([...role])
const teamPath = R.lensPath([...team])
const gameModePath = R.lensPath([...gameMode])
const cardsPath = R.lensPath([...cards])
const colorsPath = R.lensPath([...colors])
const colorsTeamPath = (team) =>
  R.lensPath(colorsTeam(team))
const backgroundColorPath = (team) =>
  R.lensPath([...colorsTeamBackgroundColor(team)])
const currentTeamPath = R.lensPath([...currentTeam])
const cardsIdPath = (id) => R.lensPath(cardsId(id))
const cardsFlippedPath = (id) => R.lensPath(cardsFlipped(id))
const wsPath = R.lensPath([...ws])
const usernamePath = R.lensPath([...username])
const editingPath = R.lensPath([...editing])
const userListPath = R.lensPath([...userList])
const userListUserPath = (idx) =>
  R.lensPath([...userListUser(idx)])
const usersPath = R.lensPath([...users])
const usersUserPath = (idx) =>
  R.lensPath([...usersUser(idx)])
const usersUserUsernamePath = (idx) =>
  R.lensPath([...usersUserUsername(idx)])

export default {
  usersUserUsernamePath,
  usersUserPath,
  userListUserPath,
  usersPath,
  remoteStatePath,
  userListPath,
  editingPath,
  usernamePath,
  wsPath,
  timePath,
  errorPath,
  errorTextPath,
  errorSeverityPath,
  actionLogPath,
  replayingPath,
  showTitlePath,
  playerTypePath,
  gameModePath,
  cardsPath,
  backgroundColorPath,
  rolePath,
  teamPath,
  currentTeamPath,
  colorsPath,
  colorsTeamPath,
  settingsPath,
  cardsIdPath,
  cardsFlippedPath,
}
