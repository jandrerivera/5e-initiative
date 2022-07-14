import type { NextPage } from 'next';
import Head from 'next/head';
import { trpc } from '../utils/trpc';
import React from 'react';

const Home: NextPage = () => {
  // const { data } = trpc.useQuery(['example.hello', { text: 'from tRPC' }]);
  const { data } = trpc.useQuery(['auth.getSession']);
  console.log(data);
  return <>Hello, you.</>;
};

export default Home;
