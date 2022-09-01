import { ProtectedNextPage } from '../../_app'
import { trpc } from '../../../utils/trpc'
import { useRouter } from 'next/router'

import { CreatureWithJoinsSchemaType } from '../../../schema/bestiary'
import { SubmitHandler } from 'react-hook-form'
import CreatureForm from '../../../components/bestiary/CreatureForm'

const EditCharacterPage: ProtectedNextPage = () => {
  const router = useRouter()
  const { id } = router.query

  const { data } = trpc.proxy.bestiary.getUniqueById.useQuery({ id: id as string })

  const { mutate, isLoading, error } = trpc.proxy.bestiary.update.useMutation()

  const onSubmit: SubmitHandler<CreatureWithJoinsSchemaType> = (data) => {
    if (data.fromSRD) return
    mutate(data)
  }

  if (!data) return <>Character not found</>

  return (
    <div>
      <h1 className='text-3xl'>Edit Character</h1>
      {error && <div>Error: {error.message}</div>}
      <CreatureForm formData={data} onSubmit={onSubmit} loading={isLoading} />
    </div>
  )
}
export default EditCharacterPage

EditCharacterPage.requireAuth = true
