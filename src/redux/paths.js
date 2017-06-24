import R from 'ramda'

// Paths & Initial State
const localState = ['localState']
const remoteState = ['remoteState']
const playerType = [...localState, 'playerType']
const role = [...playerType, 'role']
const team = [...playerType, 'team']
const gameMode = [...remoteState, 'gameMode']
const cards = [...remoteState, 'cards']
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

export default {
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
}
