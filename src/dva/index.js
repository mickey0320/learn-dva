import React from "react"
import ReactDOM from "react-dom"
import { createStore, applyMiddleware, combineReducers } from "redux"
import { Provider, connect } from "react-redux"
import { createBrowserHistory } from "history"
import createSagaMiddleware from "redux-saga"
import * as sideEffects from "redux-saga/effects"

function dva(opts = {}) {
  const history = opts.history || createBrowserHistory()
  const app = {
    _models: [],
    _router: null,
    model,
    router,
    start,
  }
  const initialReducers = {}

  function model(m) {
    const prefixModel = prefixNamespace(m)
    app._models.push(prefixModel)

    return prefixModel
  }

  function router(router) {
    app._router = router
  }

  function start(selector) {
    const sagaMiddleware = createSagaMiddleware()
    const rootReducer = createReducer(app)
    const sagas = getSagas(app)
    const store = applyMiddleware(sagaMiddleware)(createStore)(rootReducer)
    sagas.forEach(sagaMiddleware.run)
    ReactDOM.render(
      <Provider store={store}>{app._router({ app, history })}</Provider>,
      document.querySelector(selector)
    )
  }

  function prefixNamespace(model) {
    model.reducers = prefix(model, "reducers")
    model.effects = prefix(model, "effects")
    return model
  }

  function prefix(model, field) {
    return Object.keys(model[field]).reduce((memo, key) => {
      memo[`${model.namespace}/${key}`] = model[field][key]
      return memo
    }, {})
  }

  function createReducer(app) {
    for (let model of app._models) {
      initialReducers[model.namespace] = getReducer(model)
    }
    return combineReducers({
      ...initialReducers,
    })
  }

  function getReducer(model) {
    return function (state = model.state || {}, action) {
      const reducer = model.reducers[action.type]
      if (reducer) {
        return reducer(state, action)
      }
      return state
    }
  }
  function getSagas(app) {
    const sagas = []
    for (let model of app._models) {
      sagas.push(getSaga(model))
    }

    return sagas
  }
  function getSaga(model) {
    return function* () {
      for (let key in model.effects) {
        const wathcer = getWatcher(key, model)
        yield sideEffects.fork(wathcer)
      }
    }
  }
  function getWatcher(key, m) {
    function put(action) {
      return sideEffects.put({
        ...action,
        type: `${m.namespace}/${action.type}`,
      })
    }
    const watcher = function* () {
      yield sideEffects.takeEvery(key, function* (action) {
        yield m.effects[key](action, { ...sideEffects, put })
      })
    }
    return watcher
  }

  return app
}

export default dva
export { connect }