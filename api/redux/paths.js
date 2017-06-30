import R from 'ramda'

const localStateA = ['localState']
const usersA = [...localStateA, 'users']
const userByUserIdA = (userId) => [...usersA, userId]
const wsByUserIdA = (userId) => [...userByUserIdA(userId), 'ws']

export const usersPath = R.lensPath(usersA)
export const userByUserIdPath = (userId) => R.lensPath(userByUserIdA(userId))
export const wsByUserIdPath = (userId) => R.lensPath(wsByUserIdA(userId))
