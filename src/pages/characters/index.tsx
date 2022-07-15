import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';

const CharactersPage = () => {
  const { data, isLoading } = trpc.useQuery(['character.getAllbyUserId']);

  if (isLoading) return <>Loading...</>;
  if (!data) return <>No Data</>;

  return (
    <div>
      <h1 className='text-3xl'>Characters</h1>
      <div className='text-sm py-4'>{data.length} Characters</div>
      <div>
        <Link href='/character/new'>Add New</Link>
      </div>
      <ul>
        {data.map((character) => (
          <li key={character.id} className='border p-2'>
            <div>Name: {character.name}</div>
            <div>Type: {character.type}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default CharactersPage;

CharactersPage.requireAuth = true;
