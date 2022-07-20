import { ProtectedNextPage } from '../../_app';
import { trpc } from '../../../utils/trpc';
import { useRouter } from 'next/router';

import { CreatureSchemaType } from '../../../schema/creatures';
import { SubmitHandler } from 'react-hook-form';
import CreatureForm from '../../../components/bestiary/CreatureForm';

const EditCharacterPage: ProtectedNextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data } = trpc.useQuery(['creatures.get-unique-by-id', { id: id as string }]);

  const { mutate, error } = trpc.useMutation(['creatures.update']);

  const onSubmit: SubmitHandler<CreatureSchemaType> = (data) => {
    mutate(data);
    console.log(data);
  };

  if (!data) return <>Character not found</>;
  // console.log(data);
  return (
    <div>
      <h1 className='text-3xl'>Edit Character</h1>
      {/* {error && <div>Error: {error.message}</div>} */}
      <CreatureForm formData={data} onSubmit={onSubmit} />
    </div>
  );
};
export default EditCharacterPage;

EditCharacterPage.requireAuth = true;
