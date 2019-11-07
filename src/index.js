import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import { Router } from '@reach/router';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink, concat } from 'apollo-link';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { typeDefs, resolvers } from './resolvers';
import Pages from './pages';
import Login from './pages/login';
import SharedCart from './pages/sharedCart';

import globalStyles from './styles';
import { Global } from '@emotion/core';

const URI = process.env.NODE_ENV === "production" ? "https://spacex-explorer-server.herokuapp.com" : "http://localhost:4000";

export const defaultCache = {
  data: {
    isLoggedIn: !!localStorage.getItem("token")
  }
};

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

const IsLoggedIn = () => {
  const { data } = useQuery(IS_LOGGED_IN);
  return data.isLoggedIn ? <Pages /> : <Login />;
};

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: URI,
  headers: {
    authorization: localStorage.getItem("token")
  }
});

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: localStorage.getItem("token") || null
    }
  });

  return forward(operation);
});

cache.writeData(defaultCache);

const client = new ApolloClient({
  cache,
  typeDefs,
  resolvers,
  link: concat(authMiddleware, link)
});

ReactDOM.render(
  <>
    <Global styles={globalStyles} />
    <ApolloProvider client={client}>
      <Router primary={false} component={Fragment}>
        <SharedCart path="cart/:userId" />
        <IsLoggedIn default />
      </Router>
    </ApolloProvider>
  </>,
  document.querySelector("#root")
);
