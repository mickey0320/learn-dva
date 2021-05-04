import React from "react"

const defaultLoadingComponent = (props) => <div>loading</div>

function dynamic(config) {
  const { app, component, models } = config
  const LoadingComponent = config.loadingComponent || defaultLoadingComponent

  return class extends React.Component {
    state = {
      AsyncComponent: null,
    }
    async componentDidMount() {
      const [resolveModels, Component] = await Promise.all([
        Promise.all(models()),
        component(),
      ])
      resolveModels.forEach((m) => {
        app.model(m.default || m)
      })
      this.setState({
        AsyncComponent: Component.default || Component,
      })
    }
    render() {
      const { AsyncComponent } = this.state
      return AsyncComponent ? (
        <AsyncComponent {...this.props} />
      ) : (
        <LoadingComponent />
      )
    }
  }
}

export default dynamic
