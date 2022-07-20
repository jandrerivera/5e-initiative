import {
  useForm,
  SubmitHandler,
  DeepPartial,
  useFieldArray,
  UseFormRegister,
  Control,
  FieldArrayPath,
} from 'react-hook-form';

import { CreatureWithJoinsSchemaType } from '../../schema/bestiary';

import {
  AbilityScoreField,
  CheckboxInput,
  NumberInput,
  SelectInput,
  SkillField,
  TextInput,
} from '../formInputs';

type TForm = CreatureWithJoinsSchemaType;

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
      <TextInput label='Name' field='name' register={register} />
      <TextInput label='Avatar' field='avatar' register={register} />

      <TextInput label='Alignment' field='alignment' register={register} />

      <TextInput label='Creature Size' field='creatureSize' register={register} />
      <TextInput label='Species Type' field='creatureType' register={register} />
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
      <AbilityScoreField label='CHA' field='cha' register={register} />

      <TypeArrayField
        label='Saving Throws'
        fieldArray={'savingThrows'}
        control={control}
        register={register}
      />
      <TypeArrayField
        label='Condition Immunities'
        fieldArray={'conditionImmunities'}
        control={control}
        register={register}
      />
      <TypeArrayField
        label='Damage Vulnerabilities'
        fieldArray={'damageVulnerabilities'}
        control={control}
        register={register}
      />
      <TypeArrayField
        label='Damage Resistances'
        fieldArray={'damageResistances'}
        control={control}
        register={register}
      />
      <TypeArrayField
        label='Damage Immunities'
        fieldArray={'damageImmunities'}
        control={control}
        register={register}
      />

      <SkillsField control={control} register={register} />
      <SensesField control={control} register={register} />
      <LanguagesField control={control} register={register} />

      <button>Submit</button>
    </form>
  );
};

type ArrayFielsProps<T> = {
  control: Control<T>;
  register: UseFormRegister<T>;
};

type TypeArrayFieldProps<T> = {
  label?: string;
  fieldArray: Exclude<FieldArrayPath<T>, 'languages' | 'senses' | 'skills'>;
} & ArrayFielsProps<T>;

const TypeArrayField = ({
  label,
  fieldArray,
  control,
  register,
}: TypeArrayFieldProps<CreatureWithJoinsSchemaType>) => {
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: fieldArray, // unique name for your Field Array
  });

  return (
    <div className='border p-2'>
      {label && <h3 className='text-xl font-bold'>{label}</h3>}
      <ul>
        {fields.map((field, i) => (
          <div key={field.id} className='flex flex-row gap-2'>
            <TextInput label='' field={`${fieldArray}.${i}.type`} register={register} />
            <button type='button' className='bg-slate-200 p-2' onClick={() => remove(i)}>
              Remove
            </button>
          </div>
        ))}
        <button type='button' className='bg-slate-200 p-2' onClick={() => append({})}>
          Add {label}
        </button>
      </ul>
    </div>
  );
};

const SkillsField = ({ control, register }: ArrayFielsProps<CreatureWithJoinsSchemaType>) => {
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'skills', // unique name for your Field Array
  });

  return (
    <div className='border p-2'>
      <h3 className='text-xl font-bold'>Skills</h3>
      <ul>
        {fields.map((field, i) => (
          <div key={field.id} className='flex flex-row gap-2'>
            <TextInput label='Avatar' field={`skills.${i}.type`} register={register} />
            <CheckboxInput label='Avatar' field={`skills.${i}.proficient`} register={register} />
            <CheckboxInput label='Avatar' field={`skills.${i}.expertise`} register={register} />
            <button type='button' className='bg-slate-200 p-2' onClick={() => remove(i)}>
              Remove
            </button>
          </div>
        ))}
        <button type='button' className='bg-slate-200 p-2' onClick={() => append({})}>
          Add Skill
        </button>
      </ul>
    </div>
  );
};

const SensesField = ({ control, register }: ArrayFielsProps<CreatureWithJoinsSchemaType>) => {
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'senses', // unique name for your Field Array
  });

  return (
    <div className='border p-2'>
      <h3 className='text-xl font-bold'>Senses</h3>
      <ul>
        {fields.map((field, i) => (
          <div key={field.id} className='flex flex-row gap-2'>
            <TextInput label='Avatar' field={`senses.${i}.type`} register={register} />
            <NumberInput label='Avatar' field={`senses.${i}.distance`} register={register} />
            <button type='button' className='bg-slate-200 p-2' onClick={() => remove(i)}>
              Remove
            </button>
          </div>
        ))}
        <button type='button' className='bg-slate-200 p-2' onClick={() => append({})}>
          Add Sense
        </button>
      </ul>
    </div>
  );
};

const LanguagesField = ({ control, register }: ArrayFielsProps<CreatureWithJoinsSchemaType>) => {
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'languages', // unique name for your Field Array
  });

  return (
    <div className='border p-2'>
      <h3 className='text-xl font-bold'>Languages</h3>
      <ul>
        {fields.map((field, i) => (
          <div key={field.id} className='flex flex-row gap-2'>
            <TextInput label='Avatar' field={`languages.${i}.languageName`} register={register} />
            <CheckboxInput label='Avatar' field={`languages.${i}.speaks`} register={register} />
            <CheckboxInput
              label='Avatar'
              field={`languages.${i}.understands`}
              register={register}
            />
            <TextInput label='Avatar' field={`languages.${i}.exception`} register={register} />
            <NumberInput label='Avatar' field={`languages.${i}.distance`} register={register} />
            <button type='button' className='bg-slate-200 p-2' onClick={() => remove(i)}>
              Remove
            </button>
          </div>
        ))}
        <button type='button' className='bg-slate-200 p-2' onClick={() => append({})}>
          Add Sense
        </button>
      </ul>
    </div>
  );
};

export default CreatureForm;
