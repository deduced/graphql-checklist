import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

console.log(process.env.API_ENDPOINT);
//See the HASURA documentation for quick set up with heroku
const client = new ApolloClient({
  uri: process.env.REACT_APP_API_ENDPOINT
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,

  document.getElementById("🤓")
);
