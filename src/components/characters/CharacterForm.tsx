import { useRouter } from 'next/router';
import { useId } from 'react';
import { useForm, SubmitHandler, UseFormRegister, DeepPartial } from 'react-hook-form';
import { NewCharacterSchemaType, CharacterSchemaType } from '../../schema/characters';

type FormDataType = CharacterSchemaType;

type CharacterFormProps = {
  formData: DeepPartial<FormDataType>;
  onSubmit: SubmitHandler<FormDataType>;
};

const CharacterForm = ({ formData, onSubmit }: CharacterFormProps) => {
  const { register, handleSubmit } = useForm<FormDataType>({ defaultValues: formData });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput label='Name' field='name' register={register} />
      <TextInput label='Player Name' field='playerName' register={register} />
      <TextInput label='Avatar' field='avatar' register={register} />
      <SelectInput
        label='Character Type'
        field='type'
        options={[
          { value: 'PC', label: 'PC' },
          { value: 'NPC', label: 'NPC' },
          { value: 'Monster', label: 'Monster' },
        ]}
        register={register}
      />

      <CheckboxInput label='Friendly?' field='isFriendly' register={register} />
      <CheckboxInput label='Dead?' field='isDead' register={register} />

      <TextInput label='Race' field='race' register={register} />
      <TextInput label='Class' field='characterClass' register={register} />
      <TextInput label='Sub Class' field='subclass' register={register} />
      <NumberInput label='Level' field='level' register={register} />
      <NumberInput label='XP' field='experiencePoints' register={register} />

      <TextInput label='Alignment' field='alignment' register={register} />

      <TextInput label='Creature Size' field='creatureSize' register={register} />
      <TextInput label='Species Type' field='speciesType' register={register} />
      <TextInput label='Challenge Ration' field='challengeRating' register={register} />
      <TextInput label='Source' field='source' register={register} />

      <TextInput label='Max HP' field='hpMax' register={register} />
      <TextInput label='AC' field='ac' register={register} />
      <TextInput label='Spell Save DC' field='spellSave' register={register} />
      <TextInput label='Speed' field='speed' register={register} />
      <TextInput label='Initiative Bonus' field='initiative' register={register} />

      <CheckboxInput label='Inspiration' field='inspiration' register={register} />

      <AbilityScoreField label='STR' field='str' register={register} />
      <AbilityScoreField label='DEX' field='dex' register={register} />
      <AbilityScoreField label='CON' field='con' register={register} />
      <AbilityScoreField label='INT' field='int' register={register} />
      <AbilityScoreField label='WIS' field='wis' register={register} />
      <AbilityScoreField label='CHA' field='cha' register={register} />

      <SkillField label='Acrobatics' field='skillAcrobaticsProficient' register={register} />
      <SkillField label='Acrobatics' field='skillAnimalHandlingProficient' register={register} />
      <SkillField label='Acrobatics' field='skillArcanaProficient' register={register} />
      <SkillField label='Acrobatics' field='skillAthleticsProficient' register={register} />
      <SkillField label='Acrobatics' field='skillDeceptionProficient' register={register} />
      <SkillField label='Acrobatics' field='skillHistoryProficient' register={register} />
      <SkillField label='Acrobatics' field='skillInsightProficient' register={register} />
      <SkillField label='Acrobatics' field='skillIntimidationProficient' register={register} />
      <SkillField label='Acrobatics' field='skillInvestigationProficient' register={register} />
      <SkillField label='Acrobatics' field='skillMedicineProficient' register={register} />
      <SkillField label='Acrobatics' field='skillNatureProficient' register={register} />
      <SkillField label='Acrobatics' field='skillPerceptionProficient' register={register} />
      <SkillField label='Acrobatics' field='skillPerformanceProficient' register={register} />
      <SkillField label='Acrobatics' field='skillPersuasionProficient' register={register} />
      <SkillField label='Acrobatics' field='skillReligionProficient' register={register} />
      <SkillField label='Acrobatics' field='skillSleightOfHandProficient' register={register} />
      <SkillField label='Acrobatics' field='skillStealthProficient' register={register} />
      <SkillField label='Acrobatics' field='skillSurvivalProficient' register={register} />

      <button>Submit</button>
    </form>
  );
};

type InputFieldProps = {
  field: keyof FormDataType;
  label: string;
  register: UseFormRegister<FormDataType>;
};

const TextInput = ({ field, label, register }: InputFieldProps) => {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type='text' {...register(field)}></input>
    </div>
  );
};

const NumberInput = ({ field, label, register }: InputFieldProps) => {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type='number'
        {...register(field, {
          valueAsNumber: true,
        })}
      ></input>
    </div>
  );
};

const CheckboxInput = ({ field, label, register }: InputFieldProps) => {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type='checkbox' {...register(field)}></input>
    </div>
  );
};

type SelectInputProps = InputFieldProps & {
  options: { value: string; label: string }[];
};

const SelectInput = ({ field, label, options, register }: SelectInputProps) => {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <select {...register(field)}>
        {options.map(({ value, label }, i) => (
          <option key={i} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

const AbilityScoreField = ({ field, label, register }: InputFieldProps) => {
  const scoreID = useId();
  const bonusId = useId();

  const bonus = `${field}Bonus` as typeof field;

  return (
    <div>
      <label htmlFor={scoreID}>{label}</label>
      <input id={scoreID} type='text' {...register(field)}></input>
      <label htmlFor={bonusId}>Save Bonus</label>
      <input id={bonusId} type='checkbox' {...register(bonus)}></input>
    </div>
  );
};

const SkillField = ({ field, label, register }: InputFieldProps) => {
  const proficiencyId = useId();
  const expertiseId = useId();

  const expertise = `${field.replace('Proficient', 'Expertise')}` as typeof field;

  return (
    <div>
      <label htmlFor={proficiencyId}>{label}</label>
      <input id={proficiencyId} type='checkbox' {...register(field)}></input>
      <label htmlFor={expertiseId}>Expertise</label>
      <input id={expertiseId} type='checkbox' {...register(expertise)}></input>
    </div>
  );
};

export default CharacterForm;
