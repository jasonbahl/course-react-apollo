import React, { Component } from "react"
import AppLayout from "./components/AppLayout"
import TaskManager from "./components/TaskManager"

class App extends Component {
  render() {
    return (
      <AppLayout>
        <TaskManager />
      </AppLayout>
    )
  }
}

export default App
