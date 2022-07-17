import { trpc } from '../../utils/trpc';
import Link from 'next/link';

const CharactersList = () => {
  const { data, isLoading, refetch } = trpc.useQuery(['character.getAllByType']);
  const { mutate, error } = trpc.useMutation('character.delete', { onSuccess: () => refetch() });

  if (isLoading) return <>Loading...</>;
  if (!data) return <>No Data</>;

  const { PCs, NPCs } = data;
  const handleDelete = (id: string) => mutate({ id });

  return (
    <div>
      {error && <div>Error: {error.message}</div>}

      <h2 className='text-xl'>PCs</h2>

      <div>No. of Characters: {PCs.length}</div>
      <ul>
        {PCs.map((character) => (
          <li key={character.id} className='border p-2'>
            <div>Name: {character.name}</div>
            <div>Type: {character.type}</div>
            <div>ID: {character.id}</div>
            <Link href={`/characters/edit/${character.id}`}>Edit</Link>
            <div onClick={() => handleDelete(character.id)}>Delete</div>
          </li>
        ))}
      </ul>

      <h2 className='text-xl'>NPCs</h2>
      <div>No. of Characters: {NPCs.length}</div>
      <ul>
        {NPCs.map((character) => (
          <li key={character.id} className='border p-2'>
            <div>Name: {character.name}</div>
            <div>Type: {character.type}</div>
            <div>ID: {character.id}</div>
            <Link href={`/characters/edit/${character.id}`}>Edit</Link>
            <div onClick={() => handleDelete(character.id)}>Delete</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const List = () => {
  return <div>CharactersList</div>;
};
export default CharactersList;
