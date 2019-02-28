import { InMemoryCache } from "apollo-cache-inmemory"
import { HttpLink } from "apollo-link-http"
import { ApolloClient } from "apollo-client"

import { split, ApolloLink } from "apollo-link"
import { WebSocketLink } from "apollo-link-ws"
import { getMainDefinition } from "apollo-utilities"
import { clientStateLink } from "./localState"

const GRAPHQL_PORT = process.env.REACT_APP_GRAPHQL_PORT || 3010

export const cache = new InMemoryCache()

const httpLink = new HttpLink({
  uri: `http://localhost:${GRAPHQL_PORT}/graphql`,
})

const webSocketLink = new WebSocketLink({
  uri: `ws://localhost:${GRAPHQL_PORT}/graphql`,
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === "OperationDefinition" && operation === "subscription"
  },
  webSocketLink,
  ApolloLink.from([clientStateLink, httpLink])
)

export const client = new ApolloClient({
  link,
  cache,
  connectToDevTools: true,
})
