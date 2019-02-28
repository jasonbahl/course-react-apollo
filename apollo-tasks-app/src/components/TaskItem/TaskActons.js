import React from "react"
import { Mutation } from "react-apollo"
import { Button } from "antd"
import gql from "graphql-tag"
import { GET_TASKS_QUERY } from "../TaskList"

const DELETE_TASK_MUTATION = gql`
  mutation DELETE_TASK($id: ID!) {
    deleteTask(id: $id)
  }
`
export const DeleteTaskButton = ({ id, filters }) => (
  <Mutation
    mutation={DELETE_TASK_MUTATION}
    variables={{ id }}
    refetchQueries={[
      {
        query: GET_TASKS_QUERY,
        variables: { filters },
        fetchPolicy: `network-only`,
      },
    ]}
  >
    {deleteTask => (
      <Button type="danger" onClick={() => deleteTask()}>
        Delete
      </Button>
    )}
  </Mutation>
)

const MARK_TASK_COMPLETE_MUTATION = gql`
  mutation MARK_TASK_COMPLETE($id: ID!) {
    markTaskComplete(id: $id)
  }
`
export const MarkTaskCompleteButton = ({ id, filters }) => (
  <Mutation
    mutation={MARK_TASK_COMPLETE_MUTATION}
    variables={{ id }}
    refetchQueries={[
      {
        query: GET_TASKS_QUERY,
        variables: { filters },
        fetchPolicy: `network-only`,
      },
    ]}
  >
    {markTaskComplete => (
      <Button
        style={{ marginRight: `10px` }}
        type="primary"
        onClick={() => markTaskComplete()}
      >
        Mark Completed
      </Button>
    )}
  </Mutation>
)

const MARK_TASK_INCOMPLETE_MUTATION = gql`
  mutation MARK_TASK_INCOMPLETE($id: ID!) {
    markTaskIncomplete(id: $id)
  }
`
export const MarkTaskIncompleteButton = ({ id, filters }) => (
  <Mutation
    mutation={MARK_TASK_INCOMPLETE_MUTATION}
    variables={{ id, status: `INCOMPLETE` }}
    refetchQueries={[
      {
        query: GET_TASKS_QUERY,
        variables: { filters },
      },
    ]}
  >
    {markTaskIncomplete => (
      <Button
        style={{ marginRight: `10px` }}
        type="danger"
        ghost
        onClick={() => markTaskIncomplete()}
      >
        Mark Incomplete
      </Button>
    )}
  </Mutation>
)
