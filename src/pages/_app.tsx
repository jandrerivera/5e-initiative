// src/pages/_app.tsx
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

import { SessionProvider } from 'next-auth/react'

import Layout from '../components/Layout'
import ProtectedRoute from '../components/ProtectedRoute'

import '../styles/globals.css'
import { trpc } from '../utils/trpc'

export type ProtectedNextPage = NextPage & {
  requireAuth: boolean
}

type AppPropsWithLayout = AppProps & {
  Component: ProtectedNextPage
}

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
  )
}

export default trpc.withTRPC(MyApp)
