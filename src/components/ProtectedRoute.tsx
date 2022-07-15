import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const router = useRouter();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== 'loading') {
      //auth is initialized and there is no user
      if (!session) {
        // redirect
        router.push('/api/auth/signin');
      }
    }
  }, [session, status, router]);

  /* show loading indicator while the auth provider is still initializing */
  if (status === 'loading') {
    return <h1>Application Loading</h1>;
  }

  if (session) {
    return <>{children}</>;
  }

  return null;
};
export default ProtectedRoute;
