import { withClientState } from "apollo-link-state"
import { cache } from "../state"
import { GET_TASK_FILTERS_QUERY } from "../components/TaskManager"

export const clientStateLink = withClientState({
  cache,
  defaults: {
    taskFilters: {
      __typename: "TaskFilters",
      category: null,
      status: `ALL`,
    },
  },
  resolvers: {
    Mutation: {
      setTaskFilters: (_, { id, status }, { cache }) => {
        const data = cache.readQuery({ query: GET_TASK_FILTERS_QUERY })
        let taskFilters = { ...data.taskFilters }
        if (id || id === null) {
          taskFilters.category = id
        }
        if (status) {
          taskFilters.status = status
        }
        cache.writeData({ data: { taskFilters } })
        return null
      },
    },
  },
})
