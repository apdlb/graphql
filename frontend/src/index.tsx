import './index.css';

import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ReactDOM from 'react-dom';
import { LocalizeProvider } from 'react-localize-redux';

import App from './App';
import * as serviceWorker from './serviceWorker';

const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql"
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

const rootComponent = (
  <ApolloProvider client={client}>
    <LocalizeProvider>
      <App />
    </LocalizeProvider>
  </ApolloProvider>
);
ReactDOM.render(rootComponent, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
