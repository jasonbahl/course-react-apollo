import { PubSub } from "graphql-subscriptions"
import { CategoryModel, TasksModel } from "./models"

const pubsub = new PubSub()
const TASK_CREATED = "taskCreated"
const TASK_DELETED = "taskDeleted"
const TASK_UPDATED = "taskUpdated"

export const resolvers = {
  Query: {
    hello: () => {
      return `world`
    },
    categories: async () => {
      return await CategoryModel.getCategories();
    },
    category: async () => {
      return await CategoryModel.getCategoryById(id);
    },
    tasks: async (root, { filters = {} }) => {
      const res = await TasksModel.getTasks(filters);
      return res.tasks;
    },
    paginatedTasks: async (root, { page, limit, filters = {} }) => {

      if ( page ) {
        filters.page = page;
      }

      if ( limit ) {
        filters.limit = limit;
      }

      return await TasksModel.getTasks(filters);
    },
    task: async (root, { id } ) => {
      return await TasksModel.getTaskById(id);
    },
  },
  Task: {
    category: async ({ category }) => {
      return await ! category ? null : CategoryModel.getCategoryById( category );
    },
  },
  Category: {
    tasks: async ({ id }) => {
      const res = await TasksModel.getTasks({category: id});
      return res.tasks;
    },
  },
  Mutation: {
    createTask: async (root, { input }) => {
      return await TasksModel.createTask(input).then(task => {
        pubsub.publish(TASK_CREATED, { taskCreated: task })
        return {
          task,
        }
      })
    },
    deleteTask: async (root, { id }) => {
      return await TasksModel.getTaskById(id).then(task => {
        TasksModel.deleteTask(id);
        return task;
      }).then(task => {
        pubsub.publish(TASK_DELETED, { taskDeleted: task })
        return task;
      });
    },
    updateTask: async (root, { id, input }) => {
      return await TasksModel.updateTask(id, input).then(task => {
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
