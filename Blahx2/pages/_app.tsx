/* eslint-disable react/jsx-props-no-spreading */
import '../styles/globals.css';
import type { AppProps /*, AppContext */ } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthUserProvider } from '@/contexts/auth.user.context';

const MyApp = function ({ Component, pageProps }: AppProps) {
  return (
    // <QuerClientProvider client={}>
    <ChakraProvider>
      <AuthUserProvider>
        <Component {...pageProps} />
      </AuthUserProvider>
    </ChakraProvider>
    // </QuerClientProvider>
  );
};

export default MyApp;
