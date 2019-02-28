import React from "react"
import { Row, Col, Radio } from "antd"
import CategorySelect from "../CategorySelect"

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const TaskFilters = ({ filters, setTaskFilters }) => {
  return (
    <Row type="flex">
      <Col xs={24}>
        <h3>Filters:</h3>
        <Row type="flex" style={{ margin: `15px 0` }}>
          <Col xs={24} md={12}>
            <CategorySelect
              value={filters && filters.category ? filters.category : null}
              handleChange={value => {
                setTaskFilters({ variables: { id: value ? value : null } })
              }}
              selected={filters.category}
            />
          </Col>
          <Col xs={24} md={12}>
            <div style={{ float: `right` }}>
              <RadioGroup
                onChange={e => {
                  setTaskFilters({ variables: { status: e.target.value } })
                }}
              >
                <RadioButton selected={filters.status === `ALL`} value={`ALL`}>
                  All
                </RadioButton>
                <RadioButton
                  selected={filters.status === `COMPLETED`}
                  value={`COMPLETED`}
                >
                  Completed
                </RadioButton>
                <RadioButton
                  selected={filters.status === `INCOMPLETE`}
                  value={`INCOMPLETE`}
                >
                  Incomplete
                </RadioButton>
              </RadioGroup>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default TaskFilters
