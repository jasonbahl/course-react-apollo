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

const TaskList = ({ filters }) => (
  <Query
    query={GET_TASKS_QUERY}
    variables={{ filters: filters }}
    fetchPolicy="network-only"
  >
    {({ loading, error, data }) => {
      if (error) {
        console.log(error)
        return `Error! ${error.message}`
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
