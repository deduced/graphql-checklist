import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

//See the HASURA documentation for quick set up with heroku
const client = new ApolloClient({
  uri: "https://react-todo-graphql-dev.herokuapp.com/v1/graphql"
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,

  document.getElementById("🤓")
);
