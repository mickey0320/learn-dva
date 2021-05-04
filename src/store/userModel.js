import { delay } from "../utils"

const userModel = {
  namespace: "user",
  state: {
    list: [
      {
        id: 1,
        name: "yixin",
        age: 20,
      },
      {
        id: 2,
        name: "zhangsan",
        age: 25,
      },
    ],
  },
  reducers: {
    add(state, action) {
      const list = [...state.list, action.payload]

      return {
        ...state,
        list,
      }
    },
  },
  effects: {
    *asyncAdd(action, { put }) {
      yield delay("", 1000)
      yield put({ type: "add", payload: action.payload })
    },
  },
}

export default userModel
