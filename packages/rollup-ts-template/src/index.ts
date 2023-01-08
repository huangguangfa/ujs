import { arrowCallback } from './a'

interface Num {
  m: Number
}

function tsupfn(num: Num) {
  return num.m
}

export { arrowCallback, tsupfn }
