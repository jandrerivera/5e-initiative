import {
  useForm,
  SubmitHandler,
  DeepPartial,
  useFieldArray,
  FieldArrayPath,
  Control,
  UseFormRegister,
} from 'react-hook-form'
import { EncountersWithActorsSchemaType } from '../../schema/encounters'
import { trpc } from '../../utils/trpc'
import { CheckboxInput, SelectInput, TextAreaInput, TextInput } from '../FormInputs'

type TForm = EncountersWithActorsSchemaType

type EncountersFormProps = {
  formData?: DeepPartial<TForm>
  onSubmit: SubmitHandler<TForm>
  loading?: boolean
}

const EncountersForm = ({ formData, onSubmit, loading }: EncountersFormProps) => {
  const { control, register, handleSubmit } = useForm<TForm>({ defaultValues: formData })

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'actors', // unique name for your Field Array
  })

  const { data, isLoading } = trpc.useQuery(['encounters.get-characters-grouped-by-type'])
  if (isLoading) return <>Loading...</>
  if (!data) return <>No Data</>

  const { PCs, NPCs } = data

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput label='Name' field='name' register={register} />
      <div className='border p-2'>
        <div>
          <h2 className='text-xl'>PCs</h2>
          <ul>
            {PCs.map((character) => (
              <li key={character.id} className='border p-2 flex flex-row gap-2'>
                <div>Name: {character.name}</div>
                <button
                  type='button'
                  className='bg-slate-200 p-2'
                  onClick={() =>
                    append({
                      characterId: character.id,
                      type: 'player',
                      initiative: null,
                      creatureId: null,
                      character,
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
                <div>Name: {character.name}</div>
                <button
                  type='button'
                  className='bg-slate-200 p-2'
                  onClick={() =>
                    append({
                      characterId: character.id,
                      type: 'friendly',
                      initiative: null,
                      creatureId: null,
                      character,
                    })
                  }
                >
                  Add Actor
                </button>
              </li>
            ))}
          </ul>
        </div>

        <h3 className='text-xl font-bold'>Actors</h3>
        <div className='border p-2'>
          <ul>
            {fields.map((field, i) => (
              <div key={field.id}>
                <span>Name: {field.character?.name}</span>
                <SelectInput
                  label='Character Type'
                  field={`actors.${i}.type`}
                  options={[
                    { value: 'player', label: 'Player' },
                    { value: 'friendly', label: 'Friendly' },
                    { value: 'monster', label: 'Monster' },
                  ]}
                  register={register}
                />
                <CheckboxInput label='Visible' field={`actors.${i}.visible`} register={register} />
                <TextAreaInput label='Notes' field={`actors.${i}.notes`} register={register} />
                <button type='button' className='bg-slate-200 p-2' onClick={() => remove(i)}>
                  Remove
                </button>
              </div>
            ))}
          </ul>
        </div>
      </div>
      <button>Submit</button>
    </form>
  )
}

export default EncountersForm
