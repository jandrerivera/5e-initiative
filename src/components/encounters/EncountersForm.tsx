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

type EncountersFormProps = {
  formData?: DeepPartial<TForm>
  onSubmit: SubmitHandler<TForm>
  loading?: boolean
}

const EncountersForm = ({ formData, onSubmit, loading }: EncountersFormProps) => {
  const { data, isLoading } = trpc.proxy.character.getAllGroupedByType.useQuery()

  const { control, register, handleSubmit, watch } = useForm<TForm>({
    defaultValues: formData,
  })

  const { append, remove } = useFieldArray({
    control,
    name: 'actors',
  })

  const actors = watch('actors')

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
                    append({
                      characterId: character.id,
                      character: character,
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
                    append({
                      characterId: character.id,
                      character: character,
                      creatureId: null,
                      type: 'friendly',
                      initiative: null,
                      alias: null,
                      creature: null,
                    })
                  }}
                >
                  Add Actor
                </button>
              </li>
            ))}
          </ul>

          <h2 className='text-xl'>Custom Creatures</h2>
          <CreatureList append={append} />
          <h2 className='text-xl'>SRD Creatures</h2>
          <CreatureList fromSrd={true} append={append} />
        </div>

        <div>
          <h3 className='text-xl font-bold'>Friendly Actors</h3>
          <div>
            <ul className='border p-2'>
              {actors.map((actor, i) => {
                if (actor.type !== 'friendly') return null
                return (
                  <div key={actor.id || i}>
                    <span className='text-lg font-bold'>
                      {actor.character?.name || actor.creature?.name}
                    </span>
                    <SelectInput
                      label='Type'
                      field={`actors.${i}.type`}
                      options={[
                        { value: 'friendly', label: 'Friendly' },
                        { value: 'enemy', label: 'Enemy' },
                      ]}
                      register={register}
                    />
                    <CheckboxInput
                      label='Visible'
                      field={`actors.${i}.visible`}
                      register={register}
                    />
                    <TextAreaInput label='Notes' field={`actors.${i}.notes`} register={register} />
                    <button type='button' className='bg-slate-200 p-2' onClick={() => remove(i)}>
                      Remove
                    </button>
                  </div>
                )
              })}
            </ul>
          </div>

          <h3 className='text-xl font-bold'>Enemy Actors</h3>
          <div>
            <ul className='border p-2'>
              {actors.map((actor, i) => {
                if (actor.type !== 'enemy') return null
                return (
                  <div key={actor.id || i}>
                    <span className='text-lg font-bold'>
                      {actor.character?.name || actor.creature?.name}
                    </span>
                    <SelectInput
                      label='Type'
                      field={`actors.${i}.type`}
                      options={[
                        { value: 'friendly', label: 'Friendly' },
                        { value: 'enemy', label: 'Enemy' },
                      ]}
                      register={register}
                    />
                    <CheckboxInput
                      label='Visible'
                      field={`actors.${i}.visible`}
                      register={register}
                    />
                    <TextAreaInput label='Notes' field={`actors.${i}.notes`} register={register} />
                    <button type='button' className='bg-slate-200 p-2' onClick={() => remove(i)}>
                      Remove
                    </button>
                  </div>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
      <button>Submit</button>
    </form>
  )
}

const creaturesPerPage = 5

type CreatureListProps = { fromSrd?: boolean; append: UseFieldArrayAppend<TForm> }

const CreatureList = ({ fromSrd = false, append }: CreatureListProps) => {
  const [page, setPage] = useState(0)

  const { data, status, error } = trpc.proxy.bestiary.getAllPaginated.useQuery({
    fromSrd,
    page,
    limit: creaturesPerPage,
  })

  if (status === 'error') return <>Error: {error.message}</>
  if (status === 'loading') return <>Loading...</>
  if (!data || data.count <= 0) return <>No Creatures</>

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
                  creature: creature,
                  characterId: null,
                  initiative: null,
                  type: 'enemy',
                  alias: null,
                  character: null,
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
