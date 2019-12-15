import App from 'next/app';
import Head from 'next/head';
import { AppProvider } from '@shopify/polaris';
import { Provider } from '@shopify/app-bridge-react'; // add the provider component from App Bridge React
// When building with React, you can use the Shopify App Bridge React library 
// to initialize the library by passing your app's Shopify API Key and 
// the shop origin to the App Bridge Provider component.
import '@shopify/polaris/styles.css';//Import the Polaris CSS styles
import translations from '@shopify/polaris/locales/en.json';
import Cookies from 'js-cookie';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
  fetchOptions: {
    credentials: 'include'
  },
});

class MyApp extends App { //passes down the Polaris components, styles, and everything else typically found in index.js
  render() {
    const { Component, pageProps } = this.props;
    const config = { apiKey: API_KEY, shopOrigin: Cookies.get("shopOrigin"), forceRedirect: true };
    return (
      <React.Fragment>
        <Head>
          <title>Sample App</title>
          <meta charSet="utf-8" />
        </Head>
        <Provider config={config}>
            <AppProvider i18n={translations}>
            <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
            </AppProvider>
        </Provider>
      </React.Fragment>
    );
  }
}

export default MyApp;