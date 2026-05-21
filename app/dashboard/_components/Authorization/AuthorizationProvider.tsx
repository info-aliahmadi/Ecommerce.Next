import React, { createContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import AuthorizationService from '../../(auth)/_service/AuthorizationService';

type AuthorizationContextType = {
  permissions: string[] | null;
  loading: boolean;
};

export const AuthorizationContext = createContext<AuthorizationContextType | null>(null);

export default function AuthorizationProvider({ children }: { readonly children: ReactNode }) {
  const { data: session, status } = useSession();
  const jwt = (session as Session)?.accessToken;
  const [permissions, setPermissions] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for session to finish loading
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    // If session is unauthenticated, set loading to false
    if (status === 'unauthenticated' || !jwt) {
      setPermissions([]);
      setLoading(false);
      return;
    }

    // Only fetch permissions when we have a valid JWT and session is authenticated
    if (status === 'authenticated' && jwt) {
      setLoading(true);
      const service = new AuthorizationService(jwt);
      
      service.getUserPermissions()
        .then((permissions: any) => {
          setPermissions(permissions);
          setLoading(false);
        })
        .catch((error: any) => {
          console.error('Failed to fetch permissions:', error);
          setPermissions([]);
          setLoading(false);
        });
    }
  }, [jwt, status]);

  const value = useMemo(() => ({ permissions, loading }), [permissions, loading]);

  return (
    <AuthorizationContext.Provider value={value}>
      {children}
    </AuthorizationContext.Provider>
  );
}