import React from "react"
import { BrowserRouter as Router, Route, Link } from "./dva/router"
import dva, { connect } from "./dva"
import createLoading from "./dva/plugins/dva-loading"
import dynamic from "./dva/dynamic"
import immer from "./dva/plugins/dva-immer"
import { delay } from "./utils"

const app = dva({})
const User = dynamic({
  app,
  models: () => [
    import(/* webpackChunkName: "userModel" */ "./store/userModel"),
  ],
  component: () => import(/* webpackChunkName: "user" */ "./user"),
})
app.model({
  namespace: "counter",
  state: {
    num: 0,
  },
  reducers: {
    add(state, { payload }) {
      return {
        ...state,
        num: state.num + payload,
      }
    },
  },
  effects: {
    *asyncAdd({ payload }, { put }) {
      yield delay("hello", 1000)
      yield put({ type: "add", payload })
    },
  },
})
app.use(createLoading())
app.use(immer())

function Counter(props) {
  return (
    <div>
      <p>{props.num}</p>
      <button
        onClick={() => props.dispatch({ type: "counter/add", payload: 2 })}
      >
        加1
      </button>
      <button
        onClick={() => props.dispatch({ type: "counter/asyncAdd", payload: 2 })}
        disabled={props.loading}
      >
        异步加1
      </button>
      <p>
        <Link to="/user">go to user page</Link>
      </p>
    </div>
  )
}

const CounterWrapper = connect((state) => {
  return {
    num: state.counter.num,
    loading: state.loading.models.counter,
  }
})(Counter)

app.router(() => {
  return (
    <Router>
      <Route path="/" exact component={CounterWrapper}></Route>
      <Route path="/user" component={User}></Route>
    </Router>
  )
})

app.start("#root")
