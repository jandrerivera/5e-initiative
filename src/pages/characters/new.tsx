import NewCharacterForm from '../../components/NewCharacterForm';
import { ProtectedNextPage } from '../_app';

const NewCharacterPage: ProtectedNextPage = () => {
  return (
    <div>
      <h1 className='text-3xl'>New Character</h1>
      <NewCharacterForm />
    </div>
  );
};
export default NewCharacterPage;

NewCharacterPage.requireAuth = true;
