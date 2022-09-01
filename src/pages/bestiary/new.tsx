import { useRouter } from 'next/router'
import { SubmitHandler } from 'react-hook-form'
import CreatureForm from '../../components/bestiary/CreatureForm'
import { NewCreatureWithJoinsSchemaType } from '../../schema/bestiary'
import { trpc } from '../../utils/trpc'
import { ProtectedNextPage } from '../_app'

export const defaultValues = {
  hpMax: 0,
  ac: 0,
  spellSave: 0,
  speedWalking: 30,
  speedFlying: 30,
  speedSwimming: 30,
  speedClimbing: 30,
  speedBurrowing: 30,
  str: 10,
  dex: 10,
  con: 10,
  int: 10,
  wis: 10,
  cha: 10,
  fromSRD: false,
}

const NewCharacterPage: ProtectedNextPage = () => {
  const router = useRouter()

  const { mutate, isLoading, error } = trpc.proxy.bestiary.create.useMutation({
    onSuccess: ({ id }) => {
      router.push(`/bestiary/edit/${id}`)
    },
  })

  const onSubmit: SubmitHandler<NewCreatureWithJoinsSchemaType> = (data) => {
    mutate(data)
    console.log(data)
  }

  return (
    <div>
      <h1 className='text-3xl'>New Character</h1>
      {error && <div>Error: {error.message}</div>}

      <CreatureForm formData={defaultValues} onSubmit={onSubmit} loading={isLoading} />
    </div>
  )
}
export default NewCharacterPage

NewCharacterPage.requireAuth = true
