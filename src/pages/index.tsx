import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';

// import Head from 'next/head';

const Home = () => {
  const { data: session } = useSession();

  if (!session) return <>Please sign in.</>;

  return <>Signed in as {session.user?.name}.</>;
};

export default Home;
