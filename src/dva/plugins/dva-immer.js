import { produce } from "immer"

const handleActions = (modelReducers, defaultState) => {
  return (state = defaultState, action) => {
    const ret = produce(state, (draft) => {
      const reducer = modelReducers[action.type]
      if (reducer) {
        reducer(draft, action)
      }
    })

    return ret || {}
  }
}

export default function immer() {
  return {
    handleActions,
  }
}
