import React from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import { List } from "antd"
import TaskItem, { TaskFieldsFragment } from "../TaskItem"

export const GET_TASKS_QUERY = gql`
  query GET_TASKS($filters: TasksFilterInput) {
    tasks(filters: $filters) {
      ...TaskFields
    }
  }
  ${TaskFieldsFragment}
`

export const TASK_CREATED_SUBSCRIPTION = gql`
  subscription {
    taskCreated {
      ...TaskFields
    }
  }
  ${TaskFieldsFragment}
`

export const TASK_DELETED_SUBSCRIPTION = gql`
  subscription {
    taskDeleted {
      ...TaskFields
    }
  }
  ${TaskFieldsFragment}
`

export const TASK_UPDATED_SUBCRIPTION = gql`
subscription {
  taskUpdated {
    ...TaskFields
  }
}
${TaskFieldsFragment}
`

let unsubscribe = null
const TaskList = ({ filters }) => (
  <Query
    query={GET_TASKS_QUERY}
    variables={{ filters: filters }}
    fetchPolicy="network-only"
  >
    {({ loading, error, data, subscribeToMore }) => {
      if (error) {
        console.log(error)
        return `Error! ${error.message}`
      }
      if (!unsubscribe) {
        unsubscribe = subscribeToMore({
          document: TASK_CREATED_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev
            const { taskCreated } = subscriptionData.data
            if (taskCreated) {
              return {
                ...prev,
                tasks: [taskCreated, ...prev.tasks],
              }
            }
            return prev
          },
        })
        unsubscribe = subscribeToMore({
          document: TASK_DELETED_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev
            const { taskDeleted } = subscriptionData.data
            if (taskDeleted) {
              const index = prev.tasks.findIndex(obj => obj.id === taskDeleted.id);
              const newTasks = [
                ...prev.tasks.slice(0, index),
                ...prev.tasks.slice(index + 1)
              ]
              return {
                ...prev,
                tasks: newTasks
              }
            }
            return prev
          },
        })
        unsubscribe = subscribeToMore({
          document: TASK_UPDATED_SUBCRIPTION,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev
            const { taskUpdated } = subscriptionData.data
            if (taskUpdated) {
              const index = prev.tasks.findIndex(obj => obj.id === taskUpdated.id);
              const newTasks = [
                ...prev.tasks,
                ...prev.tasks.slice(index + 1)
              ]


              console.log( newTasks );

              return prev;
            }
            return prev
          },
        })
      }
      return (
        <List
          loading={loading}
          style={{ background: `#fff` }}
          bordered
          dataSource={data.tasks}
          renderItem={task => {
            const color = task.status === `COMPLETED` ? `green` : `transparent`
            return (
              <List.Item style={{ borderLeft: `5px solid ${color}` }}>
                <TaskItem filters={filters} task={task} />
              </List.Item>
            )
          }}
        />
      )
    }}
  </Query>
)

export default TaskList
