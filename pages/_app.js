import React from 'react';

import { ApolloProvider } from "@apollo/client";
import { useApollo } from "@/lib/apolloClient";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.scss';

const App = ({ Component, pageProps }) => {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
};

export default App;
