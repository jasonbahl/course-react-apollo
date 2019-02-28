import React from "react"
import { Layout } from "antd"
const Content = Layout

const AppLayout = ({ children }) => (
  <Layout>
    <Content style={{ minHeight: `100vh`, padding: `0 50px`, marginTop: 64 }}>
      <div style={{ padding: 24, minHeight: 380 }}>{children}</div>
    </Content>
  </Layout>
)

export default AppLayout
