import React from "react"
import { TaskFieldsFragment } from "../TaskItem"
import { Subscription, ApolloConsumer } from "react-apollo"
import { notification } from "antd"
import gql from "graphql-tag"

const TASK_CREATED_SUBSCRIPTION = gql`
  subscription TASK_CREATED {
    taskCreated {
      ...TaskFields
    }
  }
  ${TaskFieldsFragment}
`

const TaskNotifications = ({ refetchQueries, children, ...props }) => {
  return (
    <Subscription subscription={TASK_CREATED_SUBSCRIPTION}>
      {({ data, loading, error }) => {
        if (error) {
          console.error(error)
          return null
        }

        if (!loading) {
          if (data && data.taskCreated) {
            notification.open({
              message: `Task Created`,
            })
          }

          return (
            <ApolloConsumer>
              {client => {
                refetchQueries.map(refetchQuery =>
                  client.query({
                    fetchPolicy: "network-only",
                    ...refetchQuery,
                  })
                )
                return null
              }}
            </ApolloConsumer>
          )
        }

        return null
      }}
    </Subscription>
  )
}

export default TaskNotifications
