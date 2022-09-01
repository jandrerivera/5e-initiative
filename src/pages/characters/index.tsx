import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ProtectedNextPage } from '../_app'
import { trpc } from '../../utils/trpc'

const CharactersList = () => {
  const { data, isLoading, refetch } = trpc.proxy.character.getAllGroupedByType.useQuery()
  const { mutate, error } = trpc.proxy.character.delete.useMutation({ onSuccess: () => refetch() })

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
            <div>{character.name}</div>
            <div>
              {character.race} {character.characterClass}
            </div>
            <Link href={`/characters/edit/${character.id}`}>
              <a className='inline-block p-2 border rounded bg-slate-100'>Edit</a>
            </Link>
            <div
              onClick={() => handleDelete(character.id)}
              className='inline-block p-2 border rounded bg-slate-100'
            >
              Delete
            </div>
          </li>
        ))}
      </ul>

      <h2 className='text-xl'>NPCs</h2>
      <div>No. of Characters: {NPCs.length}</div>
      <ul>
        {NPCs.map((character) => (
          <li key={character.id} className='border p-2'>
            <div>{character.name}</div>
            <div>
              {character.creatureSize} {character.creatureType}
            </div>
            <Link href={`/characters/edit/${character.id}`}>
              <a className='inline-block p-2 border rounded bg-slate-100'>Edit</a>
            </Link>
            <div
              onClick={() => handleDelete(character.id)}
              className='inline-block p-2 border rounded bg-slate-100'
            >
              Delete
            </div>
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
