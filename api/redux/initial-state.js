import uuid4 from 'uuid/v4'
import R from 'ramda'
import shuffle from 'shuffle-array'

import words from '../../src/redux/words.js'
import {
  fgForHex,
} from '../../src/util.js'
import {
  ASSASSIN,
  BYSTANDER,
  TEAM_1,
  TEAM_2,
} from '../../src/constants.js'

import {
  hintTextPath,
  currentTeamPath,
  foregroundColorForTeamPath,
  backgroundColorForTeamPath,
  hintPath,
  gameUsersPath,
  cardsPath,
  usersPath as users,
  gamesPath as games,
} from './paths.js'


export const newCards = () => {
  shuffle(words)
  let numAssassins = 1
  let numBystanders = 7
  const biggerTeam = 9
  const smallerTeam = 8
  let numTeam1 = (Math.random() > 0.5) ? biggerTeam : smallerTeam
  let numTeam2 = (numTeam1 === smallerTeam) ? biggerTeam : smallerTeam

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
    R.reduce((acc, card) => R.assoc(card.id, card, acc), {}),
    (cards) => {
      shuffle(cards)
      return cards
    },
    R.map((card) => R.assoc('id', uuid4(), card)),
    R.map((text) => ({
      text,
      flipped: false,
      team: nextTeam(),
    })),
    R.take(25)
  )(words)

  return cards
}

export const newGame = () => {
  const baseGame = R.compose(
    R.set(backgroundColorForTeamPath(TEAM_1), '#f44336'),
    R.set(foregroundColorForTeamPath(TEAM_1), fgForHex('#f44336')),

    R.set(backgroundColorForTeamPath(TEAM_2), '#2196f3'),
    R.set(foregroundColorForTeamPath(TEAM_2), fgForHex('#2196f3')),

    R.set(backgroundColorForTeamPath(ASSASSIN), '#000000'),
    R.set(foregroundColorForTeamPath(ASSASSIN), fgForHex('#000000')),

    R.set(backgroundColorForTeamPath(BYSTANDER), '#686868'),
    R.set(foregroundColorForTeamPath(BYSTANDER), fgForHex('#686868')),

    R.set(hintTextPath, ''),
    R.set(hintPath, {}),
    R.set(gameUsersPath, []),
    R.set(cardsPath, newCards())
  )({})
  const currentTeam = R.compose(
    R.ifElse(R.equals(9), R.always(TEAM_1), R.always(TEAM_2)),
    R.length,
    R.keys,
    R.filter(({team: cardTeam}) => (cardTeam === TEAM_1))
  )(R.view(cardsPath, baseGame))
  return R.compose(
    R.set(currentTeamPath, currentTeam)
  )(baseGame)
}

export const initialState = R.compose(
  R.set(users, []),
  R.set(games, [])
)({})
