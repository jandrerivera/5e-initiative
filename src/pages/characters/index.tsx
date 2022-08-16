import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ProtectedNextPage } from '../_app'
import { trpc } from '../../utils/trpc'

const CharactersList = () => {
  const { data, isLoading, refetch } = trpc.useQuery(['character.get-all-grouped-by-type'])
  const { mutate, error } = trpc.useMutation('character.delete', { onSuccess: () => refetch() })

  if (isLoading) return <>Loading...</>
  if (!data) return <>No Data</>

  const { PCs, NPCs } = data
  const handleDelete = (id: string) => mutate({ id })

  return (
    <div>
      {error && <div>Error: {error.message}</div>}

      <h2 className='text-xl'>PCs</h2>

      <div>No. of Characters: {PCs.length}</div>
      <ul>
        {PCs.map((character) => (
          <li key={character.id} className='border p-2'>
            <div>Name: {character.name}</div>
            <div>Type: {character.type}</div>
            <div>ID: {character.id}</div>
            <Link href={`/characters/edit/${character.id}`}>Edit</Link>
            <div onClick={() => handleDelete(character.id)}>Delete</div>
          </li>
        ))}
      </ul>

      <h2 className='text-xl'>NPCs</h2>
      <div>No. of Characters: {NPCs.length}</div>
      <ul>
        {NPCs.map((character) => (
          <li key={character.id} className='border p-2'>
            <div>Name: {character.name}</div>
            <div>Type: {character.type}</div>
            <div>ID: {character.id}</div>
            <Link href={`/characters/edit/${character.id}`}>Edit</Link>
            <div onClick={() => handleDelete(character.id)}>Delete</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

const LazyCharactersList = dynamic(() => Promise.resolve(CharactersList), {
  ssr: false,
})

const CharactersPage: ProtectedNextPage = ({}) => {
  return (
    <div>
      <h1 className='text-3xl'>Characters</h1>
      <div>
        <Link href='/characters/new'>Add New</Link>
      </div>
      <LazyCharactersList />
    </div>
  )
}

CharactersPage.requireAuth = true

export default CharactersPage
