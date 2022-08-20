import { useEffect, useState } from 'react'
import {
  useForm,
  SubmitHandler,
  DeepPartial,
  useFieldArray,
  UseFieldArrayAppend,
} from 'react-hook-form'
import { EncountersWithActorsSchemaType } from '../../schema/encounters'
import { trpc } from '../../utils/trpc'
import { CheckboxInput, SelectInput, TextAreaInput, TextInput } from '../FormInputs'
import PaginationControls from '../PaginationControls'

type TForm = EncountersWithActorsSchemaType
type FriendlyActors = EncountersWithActorsSchemaType['friendlyActors']
type EnemyActors = EncountersWithActorsSchemaType['enemyActors']

type EncountersFormProps = {
  formData?: DeepPartial<TForm>
  onSubmit: SubmitHandler<TForm>
  loading?: boolean
}

const EncountersForm = ({ formData, onSubmit, loading }: EncountersFormProps) => {
  const { data, isLoading } = trpc.useQuery(['character.get-all-grouped-by-type'])

  const { control, register, handleSubmit, setValue } = useForm<TForm>({
    defaultValues: formData,
  })
  const friendlyActorsFieldArray = useFieldArray({ control, name: 'friendlyActors' })
  const enemyActorsFieldArray = useFieldArray({ control, name: 'enemyActors' })

  useEffect(() => {
    if (formData?.friendlyActors) {
      setValue('friendlyActors', formData.friendlyActors as FriendlyActors)
    }

    if (formData?.enemyActors) {
      setValue('enemyActors', formData.enemyActors as EnemyActors)
    }
  }, [formData, setValue])

  if (isLoading) return <>Loading...</>
  if (!data) return <>No Data</>

  const { PCs, NPCs } = data

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput label='Name' field='name' register={register} />
      <div className='flex flex-row'>
        <div>
          <h2 className='text-xl'>PCs</h2>
          <ul>
            {PCs.map((character) => (
              <li key={character.id} className='border p-2 flex flex-row gap-2'>
                <div>{character.name}</div>
                <button
                  type='button'
                  className='bg-slate-200 p-2'
                  onClick={() =>
                    friendlyActorsFieldArray.append({
                      characterId: character.id,
                      creatureId: null,
                      type: 'friendly',
                      initiative: null,
                      alias: null,
                    })
                  }
                >
                  Add Actor
                </button>
              </li>
            ))}
          </ul>

          <h2 className='text-xl'>NPCs</h2>
          <ul>
            {NPCs.map((character) => (
              <li key={character.id} className='border p-2 flex flex-row gap-2'>
                <div>{character.name}</div>
                <button
                  type='button'
                  className='bg-slate-200 p-2'
                  onClick={() => {
                    if (character.isFriendly) {
                      friendlyActorsFieldArray.append({
                        characterId: character.id,
                        creatureId: null,
                        type: 'friendly',
                        initiative: null,
                        alias: null,
                        character: character,
                        creature: null,
                      })
                    }
                    if (!character.isFriendly) {
                      enemyActorsFieldArray.append({
                        characterId: character.id,
                        creatureId: null,
                        type: 'enemy',
                        initiative: null,
                        alias: null,
                        character: character,
                        creature: null,
                      })
                    }
                  }}
                >
                  Add Actor
                </button>
              </li>
            ))}
          </ul>

          <h2 className='text-xl'>Custom Creatures</h2>
          <CreatureList append={enemyActorsFieldArray.append} />
          <h2 className='text-xl'>SRD Creatures</h2>
          <CreatureList fromSrd={true} append={enemyActorsFieldArray.append} />
        </div>

        <div>
          <h3 className='text-xl font-bold'>Actors</h3>
          <div>
            <h2 className='text-xl'>Friendlies</h2>
            <ul className='border p-2'>
              {friendlyActorsFieldArray.fields.map((actor, i) => (
                <div key={actor.id}>
                  <span className='text-lg font-bold'>
                    {actor.character?.name || actor.creature?.name}
                  </span>
                  <SelectInput
                    label='Type'
                    field={`friendlyActors.${i}.type`}
                    options={[
                      { value: 'friendly', label: 'Friendly' },
                      { value: 'enemy', label: 'Enemy' },
                    ]}
                    register={register}
                  />
                  <CheckboxInput
                    label='Visible'
                    field={`friendlyActors.${i}.visible`}
                    register={register}
                  />
                  <TextAreaInput
                    label='Notes'
                    field={`friendlyActors.${i}.notes`}
                    register={register}
                  />
                  <button
                    type='button'
                    className='bg-slate-200 p-2'
                    onClick={() => friendlyActorsFieldArray.remove(i)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </ul>
            <h2 className='text-xl'>Enemies</h2>
            <ul className='border p-2'>
              {enemyActorsFieldArray.fields.map((actor, i) => (
                <div key={actor.id}>
                  <span className='text-lg font-bold'>
                    {actor.character?.name || actor.creature?.name}
                  </span>
                  <SelectInput
                    label='Type'
                    field={`enemyActors.${i}.type`}
                    options={[
                      { value: 'friendly', label: 'Friendly' },
                      { value: 'enemy', label: 'Enemy' },
                    ]}
                    register={register}
                  />
                  <CheckboxInput
                    label='Visible'
                    field={`enemyActors.${i}.visible`}
                    register={register}
                  />
                  <TextAreaInput
                    label='Notes'
                    field={`enemyActors.${i}.notes`}
                    register={register}
                  />
                  <button
                    type='button'
                    className='bg-slate-200 p-2'
                    onClick={() => enemyActorsFieldArray.remove(i)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <button>Submit</button>
    </form>
  )
}

const creaturesPerPage = 5

const CreatureList = ({
  fromSrd = false,
  append,
}: {
  fromSrd?: boolean
  append: UseFieldArrayAppend<TForm>
}) => {
  const [page, setPage] = useState(0)

  const { data, status, error } = trpc.useQuery([
    'bestiary.get-all-paginated',
    { fromSrd, page, limit: creaturesPerPage },
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
          <li key={creature.id} className='flex flex-row items-center'>
            <div>{creature.name}</div>
            <button
              type='button'
              className='bg-slate-200 p-1'
              onClick={() =>
                append({
                  creatureId: creature.id,
                  characterId: null,
                  initiative: null,
                  type: 'enemy',
                  alias: null,
                  character: null,
                  creature: creature,
                })
              }
            >
              Add Actor
            </button>
          </li>
        ))}
      </ul>
      {creaturesPerPage < data.count && (
        <PaginationControls hasMore={data.hasMore} page={page} setPage={setPage} />
      )}
    </div>
  )
}

export default EncountersForm
