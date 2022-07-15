import Link from 'next/link';

const Navigation = () => {
  return (
    <div className='bg-slate-600 text-white p-2'>
      <ul className='flex flex-row gap-4'>
        <li>
          <Link href='/'>Home</Link>
        </li>
        <li>
          <Link href='/characters'>Characters</Link>
        </li>
        <li>
          <Link href='/api/auth/signin'>Sign In</Link>
        </li>
        <li>
          <Link href='/api/auth/signout'>Sign Out</Link>
        </li>
      </ul>
    </div>
  );
};
export default Navigation;
