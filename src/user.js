import React from "react"
import { connect } from "./dva"

const User = (props) => {
  function add() {
    props.dispatch({
      type: "user/asyncAdd",
      payload: {
        id: 10,
        name: "yanjian",
      },
    })
  }
  return (
    <div>
      {props.list.map((user) => {
        return <div key={user.id}>{user.name}</div>
      })}
      <p>
        <button onClick={add}>添加</button>
      </p>
    </div>
  )
}

export default connect((state) => {
  return {
    list: state.user.list,
  }
})(User)
