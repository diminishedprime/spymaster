import uuid4 from 'uuid/v4'
import R from 'ramda'
import shuffle from 'shuffle-array'

import {
  ASSASSIN,
  BYSTANDER,
  TEAM_1,
  TEAM_2,
  SPYMASTER,
  GAME_MODE_PICK_TEAM,
} from '../constants.js'

import {
  currentTeamPath,
  backgroundColorPath,
  rolePath,
  teamPath,
  gameModePath,
  cardsPath,
  errorPath,
  showTitlePath,
  userListPath,
  usernamePath,
  hintPath,
  timePath,
} from './paths.js'
import words from './words.js'

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

export const initialErrorState = {}
export const initialUsersList = []
export const initialHint = {
  text: '',
  number: '',
  submitted: false,
}

const currentTeam = (Math.random() > 0.5) ? TEAM_1 : TEAM_2

export const initialState = R.compose(
  R.set(currentTeamPath, currentTeam),
  R.set(backgroundColorPath(TEAM_1), '#f44336'),
  R.set(backgroundColorPath(TEAM_2), '#2196f3'),
  R.set(backgroundColorPath(ASSASSIN), '#000000'),
  R.set(backgroundColorPath(BYSTANDER), '#686868'),
  R.set(rolePath, SPYMASTER),
  R.set(teamPath, TEAM_1),
  R.set(gameModePath, GAME_MODE_PICK_TEAM),
  R.set(cardsPath, initialCards),
  R.set(errorPath, initialErrorState),
  R.set(showTitlePath, true),
  R.set(userListPath, initialUsersList),
  R.set(usernamePath, ''),
  R.set(hintPath, initialHint),
  R.set(timePath, undefined)
)({})
