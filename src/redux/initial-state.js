import uuid4 from 'uuid/v4'
import words from './words.js'
import R from 'ramda'
import { GAME_MODE_PICK_TEAM } from '../constants.js'
import shuffle from 'shuffle-array'
import paths from './paths.js'

shuffle(words)
const randTeam = () => {
  const rnd = Math.random()
  return (rnd >= 0.0 && rnd < 0.25)
    ? '1'
    : (rnd >= 0.25 && rnd < 0.5)
      ? '2'
      : (rnd >= 0.5 && rnd < 0.75)
        ? 'assassin'
        : 'bystander'
}

const initialCards = R.compose(
  R.map((card) => R.assoc('id', uuid4(), card)),
  R.map((text) => ({
    text,
    flipped: false,
    team: randTeam(),
  })),
  R.take(25)
)(words)

export const initialActionLog = []
export const initialErrorState = {}
export const initialUsersList = []

const currentTeam = (Math.random() > 0.5) ? '1' : '2'

export const initialState = R.compose(
  R.set(paths.currentTeamPath, currentTeam),
  R.set(paths.backgroundColorPath('1'), '#f44336'),
  R.set(paths.backgroundColorPath('2'), '#2196f3'),
  R.set(paths.backgroundColorPath('assassin'), '#000000'),
  R.set(paths.backgroundColorPath('bystander'), '#686868'),
  R.set(paths.rolePath, 'spymaster'),
  R.set(paths.teamPath, '1'),
  R.set(paths.gameModePath, GAME_MODE_PICK_TEAM),
  R.set(paths.cardsPath, initialCards),
  R.set(paths.errorPath, initialErrorState),
  R.set(paths.showTitlePath, true),
  R.set(paths.actionLogPath, initialActionLog),
  R.set(paths.replayingPath, false),
  R.set(paths.userListPath, initialUsersList),
  R.set(paths.usernamePath, ''),
  R.set(paths.hintTextPath, 'John'),
  R.set(paths.hintNumberPath, '3'),
  R.set(paths.hintSubmittedPath, false)
)({})
