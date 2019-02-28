import React from "react"
import { Select, Tag } from "antd"
import { Query } from "react-apollo"
import gql from "graphql-tag"

const Option = Select.Option

const ALL_CATEGORIES_QUERY = gql`
  query ALL_CATEGORIES {
    categories {
      id
      name
      color
    }
  }
`

const CategorySelect = ({ handleChange }) => (
  <Query query={ALL_CATEGORIES_QUERY}>
    {({ data, loading, error }) => {
      if (error) {
        return `Error! ${error}`
      }
      return (
        <Select
          allowClear
          disabled={loading}
          showSearch
          style={{ width: 200 }}
          placeholder="Select category"
          optionFilterProp="children"
          onChange={value => {
            handleChange(value)
          }}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {data && data.categories
            ? data.categories.map(({ id, name, color }) => (
                <Option key={id} value={id}>
                  <Tag color={color}>{name}</Tag>
                </Option>
              ))
            : null}
        </Select>
      )
    }}
  </Query>
)

export default CategorySelect
