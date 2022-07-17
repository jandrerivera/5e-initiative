import { useSession } from 'next-auth/react';
import Link from 'next/link';

const Navigation = () => {
  const { data: session } = useSession();

  return (
    <div className='bg-slate-600 text-white p-2'>
      <ul className='flex flex-row gap-4'>
        <li>
          <Link href='/'>Home</Link>
        </li>
        {!session && (
          <li>
            <Link href='/api/auth/signin'>Sign In</Link>
          </li>
        )}
        {session && (
          <>
            {/* <li>
              <Link href='/test'>Test</Link>
            </li> */}
            <li>
              <Link href='/characters'>Characters</Link>
            </li>
            <li>
              <Link href='/api/auth/signout'>Sign Out</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};
export default Navigation;
