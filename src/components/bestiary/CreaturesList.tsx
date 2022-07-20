import { trpc } from '../../utils/trpc';
import Link from 'next/link';

const CreaturesList = () => {
  const { data, isLoading, refetch } = trpc.useQuery(['bestiary.get-all']);
  const { mutate, error } = trpc.useMutation('bestiary.delete', { onSuccess: () => refetch() });

  if (isLoading) return <>Loading...</>;
  if (!data) return <>No Data</>;

  const handleDelete = (id: string) => mutate({ id });

  return (
    <div>
      {error && <div>Error: {error.message}</div>}

      <h2 className='text-xl'>Custom Creatures</h2>

      <div>No. of Creatures: {data.length}</div>
      <ul>
        {data.map((creature) => (
          <li key={creature.id} className='border p-2'>
            <div>Name: {creature.name}</div>
            <div>ID: {creature.id}</div>
            <Link href={`/bestiary/edit/${creature.id}`}>Edit</Link>
            <div onClick={() => handleDelete(creature.id)}>Delete</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreaturesList;
