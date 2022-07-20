import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ProtectedNextPage } from '../_app';
import { prisma } from '../../server/db/client';
import { trpc } from '../../utils/trpc';

const LazyCreaturesList = dynamic(() => import('../../components/bestiary/CreaturesList'), {
  ssr: false,
});

const BestiaryPage: ProtectedNextPage = ({}) => {
  return (
    <div>
      <h1 className='text-3xl'>Bestiary</h1>

      <LazyCreaturesList />
    </div>
  );
};

BestiaryPage.requireAuth = true;

export default BestiaryPage;
