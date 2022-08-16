import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ProtectedNextPage } from '../_app'
import { trpc } from '../../utils/trpc'

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

const LazyEncountersList = dynamic(() => Promise.resolve(EncountersList), {
  ssr: false,
})

const EncountersPage: ProtectedNextPage = ({}) => {
  return (
    <div>
      <h1 className='text-3xl'>Encounters</h1>
      <div>
        <Link href='/encounters/new'>Add New</Link>
      </div>
      <LazyEncountersList />
    </div>
  )
}

EncountersPage.requireAuth = true

export default EncountersPage
