import { ProtectedNextPage } from '../../_app'
import { trpc } from '../../../utils/trpc'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { EncountersWithActorsSchemaType } from '../../../schema/encounters'
import { SubmitHandler } from 'react-hook-form'

import EncountersForm from '../../../components/encounters/EncountersForm'

const EditEncountersPage: ProtectedNextPage = () => {
  const router = useRouter()
  const tctx = trpc.useContext()

  const { id } = router.query

  const { data, status, error, refetch } = trpc.useQuery([
    'encounters.get-unique-by-id-with-actors',
    { id: id as string },
  ])

  const { mutate, error: mutateError } = trpc.useMutation('encounters.update', {
    onSettled: () => refetch(),
  })

  const onSubmit: SubmitHandler<EncountersWithActorsSchemaType> = (data) => {
    mutate(data)
    console.log('derp')
  }

  if (status === 'error') return <>Error: {error.message}</>
  if (status === 'loading') return <>Loading...</>
  if (!data) return <>Encounter not found</>

  return (
    <div>
      <h1 className='text-3xl'>Edit Encounter</h1>
      {/* {mutateError && <div>Error: {mutateError.message}</div>} */}
      <EncountersForm onSubmit={onSubmit} formData={data} />
    </div>
  )
}
export default EditEncountersPage

EditEncountersPage.requireAuth = true
