import { ProtectedNextPage } from './_app';

const TestPage: ProtectedNextPage = () => {
  return (
    <div>
      <h1 className='text-3xl'>Test Page</h1>
    </div>
  );
};

export default TestPage;

TestPage.requireAuth = true;
