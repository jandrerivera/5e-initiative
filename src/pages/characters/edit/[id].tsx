import { ProtectedNextPage } from '../../_app';
import { trpc } from '../../../utils/trpc';
import { useRouter } from 'next/router';

import EditCharacterForm from '../../../components/EditCharacterForm';

const EditCharacterPage: ProtectedNextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, error } = trpc.useQuery(['character.getById', { id: id as string }]);

  if (isLoading) return <>Loading...</>;
  if (error) return <>{error.message}</>;
  if (!data) return <>Character not found</>;

  return (
    <div>
      <h1 className='text-3xl'>Edit Character</h1>
      <EditCharacterForm formData={data} />
    </div>
  );
};
export default EditCharacterPage;

EditCharacterPage.requireAuth = true;
