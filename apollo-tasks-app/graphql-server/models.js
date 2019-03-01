import fetch from "node-fetch"
import { REST_SERVER_URL } from "./index"
const uniqid = require("uniqid")

/**
 * Function to help translate the GraphQL filters into a REST friendly query
 * string
 *
 * @param filters
 * @returns {string}
 */
const buildTasksQueryString = filters => {
  filters._sort = `createdDate`
  filters._order = `desc`

  // delete the status filter if it's in the query before fetching
  if (filters && filters.status === `ALL`) {
    delete(filters.status)
  }

  // If the category argument is null, delete the argument before fetching
  if (filters.category === null) {
    delete(filters.category)
  }

  if(filters.page) {
    filters._page = filters.page;
    delete(filters.page);
  }

  if(filters.limit) {
    filters._limit = filters.limit;
    delete(filters.limit);
  }

  const searchParams = new URLSearchParams(filters)
  return searchParams.toString()
}

export const TasksModel = {
  getTasks: async filters => {

    const queryString = buildTasksQueryString(filters);

    return await fetch(`${REST_SERVER_URL}/tasks?${queryString}`)
      .then(res => res)
      .then(res => {
        let total =  res.headers.get(`X-Total-Count`);
        return {
          page: filters._page ? filters._page : null,
          limit: filters._limit ? filters._limit : null,
          nextPage: total > (filters._page * filters._limit) ? filters._page + 1 : null,
          total,
          tasks: res.json()
        }
      });
  },
  getTaskById: async id => {
    return await fetch(`${REST_SERVER_URL}/tasks/${id}`)
      .then(res => {
        return res.json()
      })
      .then(res => {
        return res
      })
  },
  createTask: async input => {

    const defaults = {
      id: uniqid(),
      status: "INCOMPLETE",
      createdDate: new Date(),
    }

    const payload = {...input, ...defaults}

    return await fetch(`${REST_SERVER_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(res => res.json())
  },
  deleteTask: async id => {
    return await fetch(`${REST_SERVER_URL}/tasks/${id}`, { method: "DELETE" }).then(() => id);
  },
  updateTask: async (id, input) => {
    return await fetch(`${REST_SERVER_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }).then(res => res.json())

  }
}

export const CategoryModel = {
  getCategories: async () => {
    return await fetch(`${REST_SERVER_URL}/categories`)
      .then(res => res.json())
  },
  getCategoryById: async id => {
    return await fetch(`${REST_SERVER_URL}/categories/${id}`)
      .then(res => res.json())
  }
}
