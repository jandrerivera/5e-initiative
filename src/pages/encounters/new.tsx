import { useRouter } from 'next/router'
import { SubmitHandler } from 'react-hook-form'
import EncountersForm from '../../components/encounters/EncountersForm'
import { NewEncountersSchemaType } from '../../schema/encounters'
import { trpc } from '../../utils/trpc'
import { ProtectedNextPage } from '../_app'

export const defaultValues = {
  status: 'ready',
  currentRound: 0,
  currentTurn: 0,
}

const NewEncountersPage: ProtectedNextPage = () => {
  const router = useRouter()

  const { mutate, isLoading, error } = trpc.useMutation(['encounters.create'], {
    onSuccess: ({ id }) => {
      router.push(`/encounters/edit/${id}`)
    },
  })

  const onSubmit: SubmitHandler<NewEncountersSchemaType> = (data) => {
    mutate(data)
    console.log(data)
  }

  return (
    <div>
      <h1 className='text-3xl'>New Character</h1>
      {error && <div>Error: {error.message}</div>}

      <EncountersForm formData={defaultValues} onSubmit={onSubmit} loading={isLoading} />
    </div>
  )
}
export default NewEncountersPage

NewEncountersPage.requireAuth = true
