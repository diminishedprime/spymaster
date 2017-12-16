import R from 'ramda'

import {
  TEAM_1,
  SPYMASTER,
  LOBBY,
} from '../constants.js'

import {
  gameIdsPath,
  remoteStatePath,
  clientUsersPath,
  scorePath,
  rolePath,
  teamPath,
  page,
  errorPath,
  showTitlePath,
  usernamePath,
  hintPath,
  timePath,
  serverAddressPath,
  connectedPath,
} from './paths.js'


export const newScore = () => ({
  TEAM_1: 0,
  TEAM_2: 0,
})

const initialScore = newScore()

export const initialErrorState = {}
export const initialUsersList = {}
export const initialHint = {
  text: '',
  number: '',
  submitted: false,
}

const newState = R.compose(
  R.set(gameIdsPath, []),
  R.set(clientUsersPath, {}),
  R.set(rolePath, SPYMASTER),
  R.set(teamPath, TEAM_1),
  R.set(page, LOBBY),
  R.set(errorPath, initialErrorState),
  R.set(showTitlePath, true),
  R.set(usernamePath, ''),
  R.set(hintPath, initialHint),
  R.set(timePath, undefined),
  R.set(scorePath, initialScore),
  R.set(serverAddressPath, 'spymaster.mjh.io'),
  R.set(connectedPath, false)
)

export const newGame = () =>
  R.view(remoteStatePath, newState())

export const initialState = newState({})
