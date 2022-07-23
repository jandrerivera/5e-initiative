import { useId } from 'react';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

//Typescript from here: www.thisdot.co/blog/how-to-create-reusable-form-components-with-react-hook-forms-and-typescript

type InputFieldProps<TFormValues extends FieldValues> = {
  field: Path<TFormValues>;
  label?: string;
  register: UseFormRegister<TFormValues>;
};

export const TextInput = <TFormValues extends FieldValues>({
  field,
  label,
  register,
}: InputFieldProps<TFormValues>) => {
  const id = useId();
  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      <input id={id} type='text' {...register(field)}></input>
    </div>
  );
};

export const NumberInput = <TFormValues extends FieldValues>({
  field,
  label,
  register,
}: InputFieldProps<TFormValues>) => {
  const id = useId();
  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
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

export const CheckboxInput = <TFormValues extends FieldValues>({
  field,
  label,
  register,
}: InputFieldProps<TFormValues>) => {
  const id = useId();
  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      <input id={id} type='checkbox' {...register(field)}></input>
    </div>
  );
};

type SelectInputProps<TFormValues extends FieldValues> = InputFieldProps<TFormValues> & {
  options: { value: string; label: string }[];
};

export const SelectInput = <TFormValues extends FieldValues>({
  field,
  label,
  options,
  register,
}: SelectInputProps<TFormValues>) => {
  const id = useId();
  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
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

export const AbilityScoreField = <TFormValues extends FieldValues>({
  field,
  label,
  register,
}: InputFieldProps<TFormValues>) => {
  const scoreID = useId();
  const bonusId = useId();

  const bonus = `${field}Bonus` as typeof field;

  return (
    <div>
      {label && <label htmlFor={scoreID}>{label}</label>}
      <input id={scoreID} type='text' {...register(field)}></input>
      <label htmlFor={bonusId}>Save Bonus</label>
      <input id={bonusId} type='checkbox' {...register(bonus)}></input>
    </div>
  );
};

export const SkillField = <TFormValues extends FieldValues>({
  field,
  label,
  register,
}: InputFieldProps<TFormValues>) => {
  const proficiencyId = useId();
  const expertiseId = useId();

  const expertise = `${field.replace('Proficient', 'Expertise')}` as typeof field;

  return (
    <div>
      {label && <label htmlFor={proficiencyId}>{label}</label>}
      <input id={proficiencyId} type='checkbox' {...register(field)}></input>
      <label htmlFor={expertiseId}>Expertise</label>
      <input id={expertiseId} type='checkbox' {...register(expertise)}></input>
    </div>
  );
};
