import type { ReactElement } from 'react';
import Navigation from './Navigation';
import { trpc } from '../utils/trpc';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const Layout = ({ children }: { children: ReactElement }) => {
  return (
    <div className='p-2'>
      <Navigation />
      <main className='p-2'>{children}</main>
    </div>
  );
};
export default Layout;
