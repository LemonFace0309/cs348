import type { AppProps } from "next/app";

import { ApolloProvider } from "@apollo/client";

import { useApollo } from "@src/lib/apollo-client";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
