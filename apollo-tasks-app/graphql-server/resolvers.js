import fetch from "node-fetch"
import { PubSub } from "graphql-subscriptions"

const uniqid = require("uniqid")
const pubsub = new PubSub()
const TASK_CREATED = "taskCreated"
const TASK_DELETED = "taskDeleted"
const TASK_UPDATED = "taskUpdated"

export const resolvers = {
  Query: {
    hello: () => {
      return `world`
    },
    categories: async (root, args, { restUrl }, info) => {
      const search = args.search ? args.search : ""
      return await fetch(`${restUrl}/categories?q=${search}`)
        .then(res => res.json())
    },
    category: async (root, { id }, { restUrl }, info) => {
      return await fetch(`${restUrl}/categories/${id}`)
        .then(res => res.json())
        .then(res => {
          // First item from the response
          return res[0] ? res[0] : null
        })
    },
    tasks: async (root, { filters }, { restUrl }) => {
      let searchArgs = {
        _sort: `createdDate`,
        _order: `desc`
      }
      if (filters.status === `COMPLETED` || filters.status === `INCOMPLETE`) {
        searchArgs.status = filters.status
      }
      if (filters.category) {
        searchArgs.category = filters.category
      }

      const searchParams = new URLSearchParams(searchArgs)
      const queryString = searchParams.toString()

      return await fetch(`${restUrl}/tasks?${queryString}`)
        .then(res => {
          return res.json()
        })
    },
    task: async (root, { id }, { restUrl }, info) => {
      return await fetch(`${restUrl}/task/${id}`)
        .then(res => {
          return res.json()
        })
        .then(res => {
          // First item from the response
          return res[0] ? res[0] : null
        })
    },
  },
  Task: {
    category: async ({ category }, args, { restUrl }, info) => {

      if (!category) {
        return await null
      }

      return await fetch(`${restUrl}/categories/${category}`)
        .then(res => res.json())
        .then(res => {
          return res
        })
    },
  },
  Category: {
    tasks: async ({ id }, args, { restUrl }, info) => {
      return await fetch(`${restUrl}/tasks?category=${id}`)
        .then(res => res.json())
    },
  },
  Mutation: {
    createTask: async (root, { input: { name, category } }, { restUrl }, info) => {

      const payload = {
        id: uniqid(),
        name,
        category: category ? category : null,
        status: "INCOMPLETE",
        createdDate: new Date(),
      }

      return await fetch(`${restUrl}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(res => res.json())
        .then(task => {
          pubsub.publish(TASK_CREATED, { taskCreated: task })
          return {
            task,
          }
        })

    },
    deleteTask: (root, { id }, { restUrl }) => {
      return fetch(`${restUrl}/tasks/${id}`)
        .then(res => res.json())
        .then(task => {
          return fetch(`${restUrl}/tasks/${id}`, { method: "DELETE" })
            .then(() => task)
        })
        .then(task => {
          pubsub.publish(TASK_DELETED, { taskDeleted: task })
          return task
        })
    },
    updateTask: async (root, { id, input }, { restUrl }) => {

      let payload = input
      payload.id = id

      return await fetch(`${restUrl}/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(res => res.json())
        .then(task => {
          pubsub.publish(TASK_UPDATED, { taskUpdated: task })
          return task
        })
    },
  },
  Subscription: {
    taskCreated: {
      subscribe: () => pubsub.asyncIterator(TASK_CREATED),
    },
    taskDeleted: {
      subscribe: () => pubsub.asyncIterator(TASK_DELETED),
    },
    taskUpdated: {
      subscribe: () => pubsub.asyncIterator(TASK_UPDATED),
    },
  },
}
