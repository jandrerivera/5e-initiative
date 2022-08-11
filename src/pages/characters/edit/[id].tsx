import { ProtectedNextPage } from '../../_app'
import { trpc } from '../../../utils/trpc'
import { useRouter } from 'next/router'

import CharacterForm from '../../../components/characters/CharacterForm'
import { CharacterSchemaType } from '../../../schema/characters'
import { SubmitHandler } from 'react-hook-form'

const EditCharacterPage: ProtectedNextPage = () => {
  const router = useRouter()
  const { id } = router.query

  const { data } = trpc.useQuery(['character.get-unique-by-id', { id: id as string }])

  const { mutate, isLoading, error } = trpc.useMutation(['character.update'])

  const onSubmit: SubmitHandler<CharacterSchemaType> = (data) => {
    mutate(data)
    console.log(data)
  }

  if (!data) return <>Character not found</>

  return (
    <div>
      <h1 className='text-3xl'>Edit Character</h1>
      {error && <div>Error: {error.message}</div>}
      <CharacterForm formData={data} onSubmit={onSubmit} loading={isLoading} />
    </div>
  )
}
export default EditCharacterPage

EditCharacterPage.requireAuth = true
