import { trpc } from '../../utils/trpc'
import Link from 'next/link'

const EncountersList = () => {
  const { data, isLoading, refetch } = trpc.useQuery(['encounters.get-all-from-user'])
  const { mutate, error } = trpc.useMutation('encounters.delete', { onSuccess: () => refetch() })

  if (isLoading) return <>Loading...</>
  if (!data) return <>No Data</>

  const handleDelete = (id: string) => mutate({ id })

  return (
    <div>
      <div>No. of Encounters: {data.length}</div>
      <ul>
        {data.map((encounter) => (
          <li key={encounter.id} className='border p-2'>
            <div>Name: {encounter.name}</div>
            <div>ID: {encounter.id}</div>
            <Link href={`/encounters/edit/${encounter.id}`}>Edit</Link>
            <div onClick={() => handleDelete(encounter.id)}>Delete</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EncountersList
