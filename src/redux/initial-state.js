import uuid4 from 'uuid/v4'
import words from './words.js'
import R from 'ramda'
import { GAME_MODE_PICK_TEAM } from '../constants.js'
import shuffle from 'shuffle-array'
import paths from './paths.js'
import {
  ASSASSIN,
  BYSTANDER,
  TEAM_1,
  TEAM_2,
  SPYMASTER,
} from '../constants.js'

shuffle(words)
const randTeam = () => {
  const rnd = Math.random()
  return (rnd >= 0.0 && rnd < 0.25)
    ? TEAM_1
    : (rnd >= 0.25 && rnd < 0.5)
      ? TEAM_2
      : (rnd >= 0.5 && rnd < 0.75)
        ? ASSASSIN
        : BYSTANDER
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
export const initialHint = {
  text: '',
  number: '',
  submitted: false,
}

const currentTeam = (Math.random() > 0.5) ? TEAM_1 : TEAM_2

export const initialState = R.compose(
  R.set(paths.currentTeamPath, currentTeam),
  R.set(paths.backgroundColorPath(TEAM_1), '#f44336'),
  R.set(paths.backgroundColorPath(TEAM_2), '#2196f3'),
  R.set(paths.backgroundColorPath(ASSASSIN), '#000000'),
  R.set(paths.backgroundColorPath(BYSTANDER), '#686868'),
  R.set(paths.rolePath, SPYMASTER),
  R.set(paths.teamPath, TEAM_1),
  R.set(paths.gameModePath, GAME_MODE_PICK_TEAM),
  R.set(paths.cardsPath, initialCards),
  R.set(paths.errorPath, initialErrorState),
  R.set(paths.showTitlePath, true),
  R.set(paths.actionLogPath, initialActionLog),
  R.set(paths.replayingPath, false),
  R.set(paths.userListPath, initialUsersList),
  R.set(paths.usernamePath, ''),
  R.set(paths.hintPath, initialHint),
  R.set(paths.timePath, undefined)
)({})
