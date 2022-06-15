import "normalize.css";
//import "../styles/globals.css";
import * as React from "react";
import Head from "next/head";
import PropTypes from "prop-types";
import { themeOptions } from "../components/MUITheme";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { store } from "../components/store";
import { Provider } from "react-redux";
import { CacheProvider } from "@emotion/react";

import createEmotionCache from "../components/createEmotionCache";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const theme = createTheme(themeOptions);
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});
const clientApollo = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <Provider store={store}>
      <ApolloProvider client={clientApollo}>
        <CacheProvider value={emotionCache}>
          <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
          </Head>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </CacheProvider>
      </ApolloProvider>
    </Provider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
