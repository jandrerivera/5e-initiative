import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import CharacterForm from '../../components/characters/CharacterForm';
import { NewCharacterSchemaType } from '../../schema/characters';
import { trpc } from '../../utils/trpc';
import { ProtectedNextPage } from '../_app';

export const defaultValues = {
  level: 0,
  experiencePoints: 0,
  hpMax: 0,
  ac: 0,
  spellSave: 0,
  initiative: 0,
  speedWalking: 30,
  str: 10,
  dex: 10,
  con: 10,
  int: 10,
  wis: 10,
  cha: 10,
};

const NewCharacterPage: ProtectedNextPage = () => {
  const router = useRouter();

  const { mutate, error } = trpc.useMutation(['character.create'], {
    onSuccess: ({ id }) => {
      router.push(`/characters/edit/${id}`);
    },
  });

  const onSubmit: SubmitHandler<NewCharacterSchemaType> = (data) => {
    mutate(data);
    console.log(data);
  };

  return (
    <div>
      <h1 className='text-3xl'>New Character</h1>
      {error && <div>Error: {error.message}</div>}

      <CharacterForm formData={defaultValues} onSubmit={onSubmit} />
    </div>
  );
};
export default NewCharacterPage;

NewCharacterPage.requireAuth = true;
