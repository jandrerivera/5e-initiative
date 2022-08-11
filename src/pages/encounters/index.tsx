import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ProtectedNextPage } from '../_app'

const LazyEncountersList = dynamic(() => import('../../components/encounters/EncountersList'), {
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
