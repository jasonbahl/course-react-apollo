import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { ApolloProvider } from "react-apollo"
import { client } from "./state"

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
)
