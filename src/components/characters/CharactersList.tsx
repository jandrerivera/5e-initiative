import { trpc } from '../../utils/trpc';
import Link from 'next/link';

const CharactersList = () => {
  const { data, isLoading, refetch } = trpc.useQuery(['character.getAllByUserId']);
  const { mutate, error } = trpc.useMutation('character.delete', { onSuccess: () => refetch() });

  if (isLoading) return <>Loading...</>;

  if (!data) return <>No Data</>;

  const handleDelete = (id: string) => mutate({ id });

  return (
    <>
      <div>No. of Characters: {data.length}</div>
      <ul>
        {data.map((character) => (
          <li key={character.id} className='border p-2'>
            <div>Name: {character.name}</div>
            <div>Type: {character.type}</div>
            <div>ID: {character.id}</div>
            <Link href={`/characters/edit/${character.id}`}>Edit</Link>
            <div onClick={() => handleDelete(character.id)}>Delete</div>
          </li>
        ))}
      </ul>
    </>
  );
};
export default CharactersList;
