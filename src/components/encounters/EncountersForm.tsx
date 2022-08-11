import { useForm, SubmitHandler, DeepPartial } from 'react-hook-form'
import { EncountersSchemaType } from '../../schema/encounters'
import {
  AbilityScoreField,
  CheckboxInput,
  NumberInput,
  SelectInput,
  SkillField,
  TextInput,
} from '../Forms'

type TForm = EncountersSchemaType

type EncountersFormProps = {
  formData?: DeepPartial<TForm>
  onSubmit: SubmitHandler<TForm>
  loading?: boolean
}

const EncountersForm = ({ formData, onSubmit, loading }: EncountersFormProps) => {
  const { register, handleSubmit } = useForm<TForm>({ defaultValues: formData })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput label='Name' field='name' register={register} />

      <button>Submit</button>
    </form>
  )
}

export default EncountersForm
