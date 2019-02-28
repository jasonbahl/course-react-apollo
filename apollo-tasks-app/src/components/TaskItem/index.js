import React, { Fragment } from "react"
import { Col, Row, Tag } from "antd"
import {
  DeleteTaskButton,
  MarkTaskCompleteButton,
  MarkTaskIncompleteButton,
} from "./TaskActons"
import gql from "graphql-tag"

export const TaskFieldsFragment = gql`
  fragment TaskFields on Task {
    id
    name
    status
    createdDate
    category {
      id
      name
      color
    }
  }
`

const TaskItem = ({ filters, task: { status, name, id, category } }) => {
  const style =
    status === `COMPLETED` ? { textDecoration: `line-through` } : null
  return (
    <Fragment>
      <Col xs={24} md={12}>
        <Fragment>
          <h2 style={style}>{name}</h2>
          {category && category.name ? (
            <Tag color={category.color}>{category.name}</Tag>
          ) : null}
        </Fragment>
      </Col>
      <Col xs={24} md={12}>
        <Row justify="end" type="flex">
          {`COMPLETED` === status ? (
            <MarkTaskIncompleteButton id={id} filters={filters} />
          ) : (
            <MarkTaskCompleteButton id={id} filters={filters} />
          )}
          <DeleteTaskButton id={id} filters={filters} />
        </Row>
      </Col>
    </Fragment>
  )
}

export default TaskItem
