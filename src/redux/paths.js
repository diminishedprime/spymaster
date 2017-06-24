import R from 'ramda'

// Paths & Initial State
const localState = ['localState']
const playerType = [...localState, 'playerType']
const gameMode = [...localState, 'gameMode']
const cards = ['cards']
const time = ['time']
const error = ['error']
const errorText = [...error, 'text']
const errorSeverity = [...error, 'severity']
const actionLog = ['actionLog']
const replaying = ['replaying']
const settings = ['settings']
const showTitle = [...settings, 'showTitle']
const colors = ['colors']
const backgroundColor = ['backgroundColor']

export const timePath = R.lensPath([...time])
export const errorPath = R.lensPath([...error])
export const errorTextPath = R.lensPath([...errorText])
export const errorSeverityPath = R.lensPath([...errorSeverity])
export const actionLogPath = R.lensPath([...actionLog])
export const replayingPath = R.lensPath([...replaying])
export const showTitlePath = R.lensPath([...showTitle])
export const playerTypePath = R.lensPath([...playerType])
export const gameModePath = R.lensPath([...gameMode])
export const cardsPath = R.lensPath([...cards])
export const backgroundColorPath = (team) =>
  R.lensPath([...colors, team, ...backgroundColor])
