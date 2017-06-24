import uuid4 from 'uuid/v4'
import words from './words.js'
import R from 'ramda'
import { GAME_MODE_PICK_TEAM } from '../constants.js'
import shuffle from 'shuffle-array'
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

export const initialCards = R.compose(
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
export const initialSettings = {
  showTitle: true,
}

export const initialState = {
  currentTeam: (Math.random() > 0.5) ? '1' : '2',
  colors: {
    '1': { backgroundColor: '#f44336' },
    '2': { backgroundColor: '#2196f3' },
    'assassin': { backgroundColor: '#000000'},
    'bystander': { backgroundColor: '#686868'},
  },
  localState: {
    playerType: {role: 'spymaster', team: 1},
    gameMode: GAME_MODE_PICK_TEAM,
  },
  cards: initialCards,
  error: initialErrorState,
  actionLog: initialActionLog,
  settings: initialSettings,
  replaying: false,
}
