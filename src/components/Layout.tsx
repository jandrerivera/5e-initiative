import { useSession } from 'next-auth/react';
import { ReactElement } from 'react';
import Navigation from './Navigation';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

const protectedRoutes = ['/test', '/characters'];

const Layout = ({ children }: { children: ReactElement }) => {
  return (
    <div className='p-2'>
      <Navigation />
      <main className='p-2'>{children}</main>
    </div>
  );
};

export default Layout;

const isProtectedRoute = (route: string) => {
  return protectedRoutes.includes(route);
};
