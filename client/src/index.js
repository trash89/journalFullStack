import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import "normalize.css";
import "./index.css";

import { themeOptions } from "./MUITheme";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

const theme = createTheme(themeOptions);
const httpLink = createHttpLink({
  uri: "http://localhost:4000/",
});
const clientApollo = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ApolloProvider client={clientApollo}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>
);
