export const typeDefs = `
type Query {
  hello: String
  category( id:ID! ): Category
  categories( search: String ): [Category]
  task( id:ID! ): Task
  tasks( filters: TasksFilterInput ): [Task]
}

type Mutation {
  createTask(input:CreateTaskInput!): CreateTaskPayload
  deleteTask(id:ID!): Boolean
  markTaskComplete(id:ID!): Boolean
  markTaskIncomplete(id:ID!): Boolean
  updateTask(id:ID! input:UpdateTaskInput!): Boolean
}

type Subscription {
  taskCreated: Task
  taskDeleted: Task
}


type CreateTaskPayload {
  task: Task
}

input CreateTaskInput {
  name: String!
  category: ID
}

input UpdateTaskInput {
  name: String
  category: ID
  status: TaskStatusEnum
}

enum TaskStatusEnum {
  ALL
  COMPLETED
  INCOMPLETE
}

input TasksFilterInput {
  status: TaskStatusEnum
  category: ID
}

type Task {
  id: ID!
  name: String
  status: TaskStatusEnum
  category: Category
  createdDate: String
}

type Category {
  id: ID!
  name: String
  color: String
  tasks: [Task]
}
`
