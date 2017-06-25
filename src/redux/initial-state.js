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
  scorePath,
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

export const newCards = () => {
  shuffle(words)
  let numAssassins = 1
  let numBystanders = 7
  const biggerTeam = 9
  const smallerTeam = 8
  let numTeam1 = (Math.random() > 0.5) ? biggerTeam : smallerTeam
  let numTeam2 = (numTeam1 === smallerTeam) ? biggerTeam: smallerTeam

  const nextTeam = () => {
    if (numAssassins > 0) {
      numAssassins--
      return ASSASSIN
    } else if (numBystanders > 0) {
      numBystanders--
      return BYSTANDER
    } else if (numTeam1 > 0) {
      numTeam1--
      return TEAM_1
    } else if (numTeam2 > 0) {
      numTeam2--
      return TEAM_2
    } else {
      throw 'There weren\'t enough team thingys'
    }
  }

  const cards = R.compose(
    R.map((card) => R.assoc('id', uuid4(), card)),
    R.map((text) => ({
      text,
      flipped: false,
      team: nextTeam(),
    })),
    R.take(25)
  )(words)

  shuffle(cards)
  return cards
}

export const newScore = () => ({
  TEAM_1: 0,
  TEAM_2: 0,
})

const initialScore = newScore()

const initialCards = newCards()

export const initialErrorState = {}
export const initialUsersList = []
export const initialHint = {
  text: '',
  number: '',
  submitted: false,
}

const currentTeam = (Math.random() > 0.5) ? TEAM_1 : TEAM_2

export const newColors = (state) => R.compose(
  R.set(backgroundColorPath(TEAM_1), '#f44336'),
  R.set(backgroundColorPath(TEAM_2), '#2196f3'),
  R.set(backgroundColorPath(ASSASSIN), '#000000'),
  R.set(backgroundColorPath(BYSTANDER), '#686868')
)(state)

export const initialState = R.compose(
  R.set(currentTeamPath, currentTeam),
  newColors,
  R.set(rolePath, SPYMASTER),
  R.set(teamPath, TEAM_1),
  R.set(gameModePath, GAME_MODE_PICK_TEAM),
  R.set(cardsPath, initialCards),
  R.set(errorPath, initialErrorState),
  R.set(showTitlePath, true),
  R.set(userListPath, initialUsersList),
  R.set(usernamePath, ''),
  R.set(hintPath, initialHint),
  R.set(timePath, undefined),
  R.set(scorePath, initialScore)
)({})
