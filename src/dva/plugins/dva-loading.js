const SHOW = "@@dva/show"
const HIDE = "@@dva/hide"
const NAMESPACE = "loading"

const defaultState = {
  global: false,
  models: {},
  effects: {},
}
function createLoading() {
  const extraReducers = {
    [NAMESPACE](state = defaultState, action) {
      const { namespace, actionType } = action.payload || {}
      switch (action.type) {
        case SHOW:
          return {
            global: true,
            models: {
              ...state.models,
              [namespace]: true,
            },
            effects: {
              ...state.effects,
              [actionType]: true,
            },
          }
        case HIDE:
          const effects = {
            ...state.effects,
            [actionType]: false,
          }
          const models = {
            ...state.models,
            [namespace]: Object.keys(effects).some((key) => {
              const _namespace = effects[key]
              if (namespace !== _namespace) {
                return false
              }
              return effects[actionType]
            }),
          }
          const global = Object.keys(models).some(
            (modelName) => models[modelName]
          )
          return {
            ...state,
            effects,
            models,
            global,
          }
        default:
          return state
      }
    },
  }

  function onEffect(effect, { put }, namespace, actionType) {
    return function* (...args) {
      try {
        yield put({ type: SHOW, payload: { namespace, actionType } })
        yield effect(...args)
      } finally {
        yield put({ type: HIDE, payload: { namespace, actionType } })
      }
    }
  }

  return {
    extraReducers,
    onEffect,
  }
}

export default createLoading
