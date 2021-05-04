import React from "react"
import { BrowserRouter as Router, Route } from "./dva/router"
import dva, { connect } from "./dva"
import { delay } from "./utils"

const app = dva()
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
      >
        异步加1
      </button>
    </div>
  )
}

const CounterWrapper = connect((state) => {
  return {
    num: state.counter.num,
  }
})(Counter)

app.router(() => {
  return (
    <Router>
      <Route path="/" component={CounterWrapper}></Route>
    </Router>
  )
})

app.start("#root")
