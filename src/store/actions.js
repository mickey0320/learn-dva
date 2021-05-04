import { ADD, ASYNC_ADD } from "./action-types"

export function add(num) {
  return {
    type: ADD,
    payload: num,
  }
}

export function asyncAdd(num) {
  return {
    type: ASYNC_ADD,
    payload: num,
  }
}
