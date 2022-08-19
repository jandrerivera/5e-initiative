import { ProtectedNextPage } from '../../_app'
import { trpc } from '../../../utils/trpc'
import { useRouter } from 'next/router'

import { EncountersWithActorsSchemaType } from '../../../schema/encounters'
import { SubmitHandler } from 'react-hook-form'
import EncountersForm from '../../../components/encounters/EncountersForm'

const EditEncountersPage: ProtectedNextPage = () => {
  const router = useRouter()
  const { id } = router.query

  const { data, status, error } = trpc.useQuery([
    'encounters.get-unique-by-id-with-actors',
    { id: id as string },
  ])
  const { mutate, isLoading, error: mutateError } = trpc.useMutation(['encounters.update'])

  const onSubmit: SubmitHandler<EncountersWithActorsSchemaType> = (data) => {
    mutate(data)
    console.log(data)
  }

  if (status === 'error') return <>Error: {error.message}</>
  if (status === 'loading') return <>Loading...</>
  if (!data) return <>Encounter not found</>

  return (
    <div>
      <h1 className='text-3xl'>Edit Encounter</h1>
      {/* {mutateError && <div>Error: {mutateError.message}</div>} */}
      <EncountersForm onSubmit={onSubmit} formData={data} loading={isLoading} />
    </div>
  )
}
export default EditEncountersPage

EditEncountersPage.requireAuth = true
