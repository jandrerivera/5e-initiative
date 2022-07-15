import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
// import Head from 'next/head';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  // const { data } = trpc.useQuery(['example.hello', { text: 'from tRPC' }]);
  const { data } = useSession();

  return <>Hello, {data ? data.user?.name : 'you'}.</>;
};

export default Home;
