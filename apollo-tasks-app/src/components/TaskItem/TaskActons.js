import React from "react"
import { Mutation } from "react-apollo"
import { Button } from "antd"
import gql from "graphql-tag"
import { GET_TASKS_QUERY } from "../TaskList"

const DELETE_TASK_MUTATION = gql`
  mutation DELETE_TASK($id: ID!) {
    deleteTask(id: $id) {
      id
      name
    }
  }
`
export const DeleteTaskButton = ({ id }) => (
  <Mutation mutation={DELETE_TASK_MUTATION} variables={{ id }}>
    {deleteTask => (
      <Button type="danger" onClick={() => deleteTask()}>
        Delete
      </Button>
    )}
  </Mutation>
)

const UPDATE_TASK_MUTATION = gql`
  mutation UPDATE_TASK($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      status
    }
  }
`
export const MarkTaskCompleteButton = ({ id }) => (
  <Mutation
    mutation={UPDATE_TASK_MUTATION}
    variables={{ id, input: { status: `COMPLETED` } }}
  >
    {updateTask => (
      <Button
        style={{ marginRight: `10px` }}
        type="primary"
        onClick={() => updateTask()}
      >
        Mark Completed
      </Button>
    )}
  </Mutation>
)

export const MarkTaskIncompleteButton = ({ id }) => (
  <Mutation
    mutation={UPDATE_TASK_MUTATION}
    variables={{ id, input: { status: `INCOMPLETE` } }}
  >
    {updateTask => (
      <Button
        style={{ marginRight: `10px` }}
        type="danger"
        ghost
        onClick={() => updateTask()}
      >
        Mark Incomplete
      </Button>
    )}
  </Mutation>
)
