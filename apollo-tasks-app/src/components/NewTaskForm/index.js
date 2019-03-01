import React, { Component } from "react"
import { Mutation } from "react-apollo"
import gql from "graphql-tag"
import { GET_TASKS_QUERY } from "../TaskList"
import { Input, Button } from "antd"
import CategorySelect from "../CategorySelect"

const CREATE_NEW_TASK_MUTATION = gql`
  mutation CREATE_NEW_TASK($input: CreateTaskInput!) {
    createTask(input: $input) {
      task {
        id
        name
        status
        category {
          id
        }
      }
    }
  }
`

class NewTaskForm extends Component {
  state = {
    name: null,
    category: null,
  }

  render() {
    const { filters } = this.props
    return (
      <Mutation
        mutation={CREATE_NEW_TASK_MUTATION}
      >
        {(createTask, { data, error, loading }) => {
          if (error) {
            console.log(error)
          }

          return (
            <form
              onSubmit={e => {
                e.preventDefault()
                const task = this.state
                createTask({ variables: { input: task } })
                this.setState({
                  name: null,
                  category: null,
                })
              }}
            >
              <h3>Create Task:</h3>
              <Input.Group compact>
                <Input
                  name="task"
                  style={{ width: `70%` }}
                  value={this.state.name}
                  defaultValue={this.state.name}
                  disabled={loading}
                  onChange={e => {
                    this.setState({ name: e.target.value })
                  }}
                  placeholder={`Type here to add a new task`}
                />
                <CategorySelect
                  name="category"
                  value={this.state.category}
                  required={true}
                  style={{ width: `20%` }}
                  handleChange={value => {
                    this.setState({ category: value })
                  }}
                />
                <Button
                  style={{ width: `10%` }}
                  type="primary"
                  htmlType="submit"
                >
                  Create Task
                </Button>
              </Input.Group>
            </form>
          )
        }}
      </Mutation>
    )
  }
}

export default NewTaskForm
