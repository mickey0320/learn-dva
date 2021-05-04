const hooks = ["extraReducers", "onEffect"]

class Plugin {
  constructor() {
    this.hooks = hooks.reduce((memo, hookName) => {
      memo[hookName] = []

      return memo
    }, {})
  }
  use(config = {}) {
    for (let hookName in config) {
      this.hooks[hookName].push(config[hookName])
    }
  }
  get(key) {
    if (key === "extraReducers") {
      return getExtraReducers(this.hooks[key])
    } else {
      return this.hooks[key]
    }
  }
}

function getExtraReducers(extraReducers) {
  let ret = {}
  for (let extraReducer of extraReducers) {
    ret = { ...ret, ...extraReducer }
  }

  return ret
}
export function filterHooks(opts) {
  const ret = {}
  for (let key in opts) {
    if (hooks.includes(key)) {
      ret[key] = opts[key]
    }
  }
  return ret
}
export default Plugin
