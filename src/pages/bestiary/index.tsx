import { GetServerSidePropsContext } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ProtectedNextPage } from '../_app'
import { prisma } from '../../server/db/client'
import { trpc } from '../../utils/trpc'
import { useState, useEffect } from 'react'
import PaginationControls from '../../components/PaginationControls'

const BestiaryPage: ProtectedNextPage = ({}) => {
  return (
    <div>
      <h1 className='text-3xl'>Bestiary</h1>
      <Link href='/bestiary/new'>Add New</Link>

      <h2 className='text-xl'>Custom Creatures</h2>
      <LazyUserCreaturesList />

      <h2 className='text-xl'>SRD Creatures</h2>
      <LazySrdCreaturesList />
    </div>
  )
}

const LazyUserCreaturesList = dynamic(() => Promise.resolve(UserCreaturesList), { ssr: false })
const LazySrdCreaturesList = dynamic(() => Promise.resolve(SrdCreaturesList), { ssr: false })

const creaturesPerPage = 20

const UserCreaturesList = () => {
  const [page, setPage] = useState(0)

  const { data, status, error, refetch } = trpc.useQuery([
    'bestiary.get-all-paginated',
    { page, limit: creaturesPerPage },
  ])

  const {
    mutate,
    error: mutateError,
    isLoading: isMutating,
  } = trpc.useMutation('bestiary.delete', {
    onSuccess: () => refetch(),
  })

  const handleDelete = (id: string, fromSRD: boolean) => {
    if (fromSRD) {
      console.log(`Can't delete items from SRD`)
      return
    }
    mutate({ id, fromSRD })
  }

  if (status === 'loading') return <>Loading...</>
  if (status === 'error') return <>Error: {error.message}</>
  if (!data) return <>No Creatures</>
  if (data.count <= 0) return <>No Creatures</>

  return (
    <div>
      {mutateError && <div>Error: {mutateError.message}</div>}
      <div>No. of Creatures: {data.count || 0}</div>
      <ul>
        {data.creatures.map((creature) => (
          <li key={creature.id} className='border p-2'>
            <div>{creature.name}</div>

            {!isMutating && (
              <>
                <Link href={`/bestiary/edit/${creature.id}`}>Edit</Link>
                <div onClick={() => handleDelete(creature.id, creature.fromSRD)}>Delete</div>
              </>
            )}
          </li>
        ))}
      </ul>

      {creaturesPerPage < data.count && (
        <PaginationControls hasMore={data.hasMore} page={page} setPage={setPage} />
      )}
    </div>
  )
}

const SrdCreaturesList = () => {
  const [page, setPage] = useState(0)

  const { data, status, error } = trpc.useQuery([
    'bestiary.get-all-paginated',
    { fromSrd: true, page, limit: creaturesPerPage },
  ])

  if (status === 'error') return <>Error: {error.message}</>
  if (status === 'loading') return <>Loading...</>
  if (!data) return <>No Creatures</>
  if (data.count <= 0) return <>No Creatures</>

  return (
    <div>
      <div>No. of Creatures: {data.count || 0}</div>
      <ul className='border p-2'>
        {data.creatures.map((creature) => (
          <li key={creature.id}>
            <div>{creature.name}</div>
            {/* <Link href={`/bestiary/${creature.id}`}>View</Link> */}
          </li>
        ))}
      </ul>

      {creaturesPerPage < data.count && (
        <PaginationControls hasMore={data.hasMore} page={page} setPage={setPage} />
      )}
    </div>
  )
}

BestiaryPage.requireAuth = true

export default BestiaryPage
