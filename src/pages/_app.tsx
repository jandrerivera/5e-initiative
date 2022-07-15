// src/pages/_app.tsx
import type { ReactElement, ReactNode } from 'react';

import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import type { AppType } from 'next/dist/shared/lib/utils';

import { withTRPC } from '@trpc/next';
import superjson from 'superjson';
import type { AppRouter } from '../server/router';
import { SessionProvider } from 'next-auth/react';

import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

import '../styles/globals.css';

export type ProtectedNextPage = NextPage & {
  requireAuth: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: ProtectedNextPage;
};

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        {Component.requireAuth ? (
          <ProtectedRoute>
            <Component {...pageProps} />
          </ProtectedRoute>
        ) : (
          // public page
          <Component {...pageProps} />
        )}
      </Layout>
    </SessionProvider>
  );
};

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '';
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
