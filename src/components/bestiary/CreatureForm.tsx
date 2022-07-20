import {
  useForm,
  SubmitHandler,
  DeepPartial,
  useFieldArray,
  UseFormRegister,
  Path,
  Control,
} from 'react-hook-form';
import { CreatureSchemaWithJoinsType } from '../../schema/creatures';
import { InferQueryOutput } from '../../utils/trpc';

import {
  AbilityScoreField,
  CheckboxInput,
  NumberInput,
  SelectInput,
  SkillField,
  TextInput,
} from '../formInputs';

type TForm = CreatureSchemaWithJoinsType;
// type TForm = InferQueryOutput<'creatures.get-unique-by-id'>;

type CreatureFormProps = {
  formData?: DeepPartial<TForm>;
  onSubmit: SubmitHandler<TForm>;
};

const CreatureForm = ({ formData, onSubmit }: CreatureFormProps) => {
  const { control, register, handleSubmit } = useForm<TForm>({
    defaultValues: formData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SkillFields data={formData} control={control} register={register} />

      {/* <TextInput label='Name' field='name' register={register} />
      <TextInput label='Avatar' field='avatar' register={register} />

      <TextInput label='Alignment' field='alignment' register={register} />

      <TextInput label='Creature Size' field='creatureSize' register={register} />
      <TextInput label='Species Type' field='creatureSize' register={register} />
      <TextInput label='Challenge Ration' field='challengeRating' register={register} />
      <TextInput label='Source' field='source' register={register} />

      <TextInput label='Max HP' field='hpMax' register={register} />
      <TextInput label='AC' field='ac' register={register} />
      <TextInput label='Hit Dice' field='hitDice' register={register} />

      <NumberInput label='Walking Speed' field='speedWalking' register={register} />
      <NumberInput label='Flaying Speed' field='speedFlying' register={register} />
      <NumberInput label='Swimming Speed' field='speedSwimming' register={register} />
      <NumberInput label='Climbing Speed' field='speedClimbing' register={register} />
      <NumberInput label='Burrowing Speed' field='speedBurrowing' register={register} />

      <AbilityScoreField label='STR' field='str' register={register} />
      <AbilityScoreField label='DEX' field='dex' register={register} />
      <AbilityScoreField label='CON' field='con' register={register} />
      <AbilityScoreField label='INT' field='int' register={register} />
      <AbilityScoreField label='WIS' field='wis' register={register} />
      <AbilityScoreField label='CHA' field='cha' register={register} /> */}
      <button>Submit</button>
    </form>
  );
};

export default CreatureForm;

type InputFieldProps<T> = {
  data?: DeepPartial<T>;
  control: Control<T, object>;
  register: UseFormRegister<T>;
};

const SkillFields = ({ data, control, register }: InputFieldProps<TForm>) => {
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'conditionImmunities', // unique name for your Field Array
  });

  return (
    <ul className='border p-2'>
      {fields.map((field, i) => (
        <div key={field.id}>
          <TextInput label='Avatar' field={`conditionImmunities.${i}.type`} register={register} />
          <button type='button' className='bg-slate-200 p-2' onClick={() => remove(i)}>
            Remove
          </button>
        </div>
      ))}
      <button
        type='button'
        className='bg-slate-200 p-2'
        onClick={() => {
          append({ creatureId: data?.id });
        }}
      >
        Add Skill
      </button>
    </ul>
  );
};
