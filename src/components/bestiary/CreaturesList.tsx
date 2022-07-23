import { trpc } from '../../utils/trpc';
import Link from 'next/link';

const CreaturesList = () => {
  const { data, status, error, refetch } = trpc.useQuery(['bestiary.get-all-grouped-by-srd']);
  const {
    mutate,
    error: mutateError,
    isLoading: isMutating,
  } = trpc.useMutation('bestiary.delete', {
    onSuccess: () => refetch(),
  });

  if (status === 'loading') return <>Loading...</>;

  if (status === 'error') return <>Error: {error.message}</>;

  if (!data) return <>No Data</>;

  const { fromSRD, customCreatures } = data;

  const handleDelete = (id: string, fromSRD: boolean) => {
    if (fromSRD) {
      console.log(`Can't delete items from SRD`);
      return;
    }
    mutate({ id, fromSRD });
  };

  return (
    <div>
      {mutateError && <div>Error: {mutateError.message}</div>}

      <h2 className='text-xl'>Custom Creatures</h2>

      <div>No. of Creatures: {customCreatures.length || 0}</div>
      <ul>
        {customCreatures.map((creature) => (
          <li key={creature.id} className='border p-2'>
            <div>Name: {creature.name}</div>
            <div>ID: {creature.id}</div>
            {!isMutating && (
              <>
                <Link href={`/bestiary/edit/${creature.id}`}>Edit</Link>
                <div onClick={() => handleDelete(creature.id, creature.fromSRD)}>Delete</div>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2 className='text-xl'>SRD Creatures</h2>

      <div>No. of Creatures: {fromSRD.length || 0}</div>
      <ul>
        {fromSRD.map((creature) => (
          <li key={creature.id} className='border p-2'>
            <div>Name: {creature.name}</div>
            <div>ID: {creature.id}</div>
            <div>SRD</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreaturesList;
