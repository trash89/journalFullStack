import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import "normalize.css";
import "./index.css";

import { themeOptions } from "./MUITheme";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache, defaultDataIdFromObject } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getUserFromLocalStorage } from "./utils/localStorage";

const theme = createTheme(themeOptions);
const httpLink = createHttpLink({
  uri: "https://journalgraphqlserver.herokuapp.com/",
});

const authLink = setContext((_, { headers }) => {
  const user = getUserFromLocalStorage();
  if (user) {
    const token = user.token;
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  } else {
    return headers;
  }
});

const clientApollo = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    dataIdFromObject(responseObject) {
      switch (responseObject.__typename) {
        case "TProfile":
          return `TProfile:${responseObject.idProfile}`;
        case "TProfilesCount":
          return `TProfilesCount:${responseObject.count}`;
        case "TClient":
          return `TClient:${responseObject.idClient}`;
        case "TClientsCount":
          return `TClientsCount:${responseObject.count}`;
        case "TProject":
          return `TProject:${responseObject.idProject}`;
        case "TProjectsCount":
          return `TProjectsCount:${responseObject.count}`;
        case "TSubproject":
          return `TSubproject:${responseObject.idSubproject}`;
        case "TSubprojectsCount":
          return `TSubprojectsCount:${responseObject.count}`;
        case "TJournal":
          return `TJournal:${responseObject.idJournal}`;
        case "TJournalsCount":
          return `TJournalsCount:${responseObject.count}`;
        case "AuthPayload":
          return `AuthPayload:${responseObject.token}`;
        default: {
          return defaultDataIdFromObject(responseObject);
        }
      }
    },
  }),
  queryDeduplication: false,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
    query: {
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
    },
    mutate: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
  },
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ApolloProvider client={clientApollo}>
        <Provider store={store}>
          <App />
        </Provider>
      </ApolloProvider>
    </ThemeProvider>
  </React.StrictMode>
);
