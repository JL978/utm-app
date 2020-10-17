import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import App, { Container } from "next/app";
import { AppProvider } from "@shopify/polaris";
import { Provider } from "@shopify/app-bridge-react";
import Cookies from "js-cookie";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import MyRouter from "../router/router";
import { StaticRouter as Router } from "react-router-dom";

const client = new ApolloClient({
  fetchOptions: {
    credentials: "include",
  },
});

const theme = {
  colors: {
    topBar: {
      background: "#225062",
    },
  },
  logo: {
    width: 124,
    topBarSource:
      "https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-color.svg?6215648040070010999",
    url: "http://jadedpixel.com",
    accessibilityLabel: "Jaded Pixel",
  },
};
class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    const shopOrigin = Cookies.get("shopOrigin");
    return (
      <Container>
        <Router>
          <AppProvider i18n={translations} theme={theme}>
            <Provider
              config={{
                apiKey: API_KEY,
                shopOrigin: shopOrigin,
                forceRedirect: true,
              }}
            >
              <ApolloProvider client={client}>
                <Component {...pageProps} />
                <MyRouter />
              </ApolloProvider>
            </Provider>
          </AppProvider>
        </Router>
      </Container>
    );
  }
}

export default MyApp;
