import { useId } from 'react';
import { Path, UseFormRegister } from 'react-hook-form';

//www.thisdot.co/blog/how-to-create-reusable-form-components-with-react-hook-forms-and-typescript

type InputFieldProps<TFormSchema> = {
  field: Path<TFormSchema>;
  label: string;
  register: UseFormRegister<TFormSchema>;
};

export const TextInput = <T,>({ field, label, register }: InputFieldProps<T>) => {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type='text' {...register(field)}></input>
    </div>
  );
};

export const NumberInput = <T,>({ field, label, register }: InputFieldProps<T>) => {
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

export const CheckboxInput = <T,>({ field, label, register }: InputFieldProps<T>) => {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type='checkbox' {...register(field)}></input>
    </div>
  );
};

type SelectInputProps<T> = InputFieldProps<T> & {
  options: { value: string; label: string }[];
};

export const SelectInput = <T,>({ field, label, options, register }: SelectInputProps<T>) => {
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

export const AbilityScoreField = <T,>({ field, label, register }: InputFieldProps<T>) => {
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

export const SkillField = <T,>({ field, label, register }: InputFieldProps<T>) => {
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
