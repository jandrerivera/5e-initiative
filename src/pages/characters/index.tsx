import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ProtectedNextPage } from '../_app';
import { prisma } from '../../server/db/client';
import { trpc } from '../../utils/trpc';

const LazyCharactersList = dynamic(() => import('../../components/characters/CharactersList'), {
  ssr: false,
});

const CharactersPage: ProtectedNextPage = ({}) => {
  return (
    <div>
      <h1 className='text-3xl'>Characters</h1>
      <div>
        <Link href='/characters/new'>Add New</Link>
      </div>
      <LazyCharactersList />
    </div>
  );
};

CharactersPage.requireAuth = true;

export default CharactersPage;
