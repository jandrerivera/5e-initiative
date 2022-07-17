import { ProtectedNextPage } from '../../_app';
import { trpc } from '../../../utils/trpc';
import { useRouter } from 'next/router';

import CharacterForm from '../../../components/characters/CharacterForm';
import { CharacterSchemaType } from '../../../schema/characters';
import { SubmitHandler } from 'react-hook-form';

const EditCharacterPage: ProtectedNextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: formData,
    isLoading,
    error: queryError,
  } = trpc.useQuery(['character.getById', { id: id as string }]);

  const { mutate, error } = trpc.useMutation(['character.update']);

  const onSubmit: SubmitHandler<CharacterSchemaType> = (data) => {
    mutate(data);
    console.log(data);
  };

  if (isLoading) return <>Loading...</>;
  if (queryError) return <>{queryError.message}</>;
  if (!formData) return <>Character not found</>;

  return (
    <div>
      <h1 className='text-3xl'>Edit Character</h1>
      {error && <div>Error: {error.message}</div>}
      <CharacterForm formData={formData} onSubmit={onSubmit} />
    </div>
  );
};
export default EditCharacterPage;

EditCharacterPage.requireAuth = true;
