import React, { Fragment } from "react"
import { Divider } from "antd"
import NewTaskForm from "../NewTaskForm"
import TaskList from "../TaskList"
import TaskFilters from "../TaskFilters"
import gql from "graphql-tag"
import { Query, Mutation } from "react-apollo"

export const GET_TASK_FILTERS_QUERY = gql`
  query GET_TASK_FILTERS {
    taskFilters @client {
      category
      status
    }
  }
`
export const SET_TASK_FILTERS_MUTATION = gql`
  mutation SET_TASK_FILTERS_MUTATION($id: ID, $status: TaskStatusEnum) {
    setTaskFilters(id: $id, status: $status) @client {
      category
      status
    }
  }
`

const TaskManager = () => (
  <Query query={GET_TASK_FILTERS_QUERY}>
    {({ data: { taskFilters } }) => {
      taskFilters && delete taskFilters.__typename
      return (
        <Mutation mutation={SET_TASK_FILTERS_MUTATION}>
          {setTaskFilters => (
            <Fragment>
              <NewTaskForm filters={taskFilters} />
              <Divider />
              <TaskFilters
                filters={taskFilters ? taskFilters : {}}
                setTaskFilters={setTaskFilters}
              />
              {/*@todo: Implement subscriptions */}
              <TaskList filters={taskFilters} />
            </Fragment>
          )}
        </Mutation>
      )
    }}
  </Query>
)

export default TaskManager
