'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { type ReactNode, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useCartStore } from '../_lib/store';
import { useCartMerge } from '../_hooks/use-cart-merge';

export function SessionProvider({ children }: { children: ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <InnerSync>{children}</InnerSync>
    </NextAuthSessionProvider>
  );
}

function InnerSync({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const setJwt = useCartStore((s) => s.setJwt);
  const { mergeLocalCartWithServer } = useCartMerge();
  const prevSessionRef = useRef(session);
  const hasMergedRef = useRef(false);

  useEffect(() => {
    const prevSession = prevSessionRef.current;

    setJwt(session?.user?.accessToken);

    const wasUnauthenticated = !prevSession?.user?.accessToken;
    const isAuthenticated = !!session?.user?.accessToken;

    if (wasUnauthenticated && isAuthenticated && !hasMergedRef.current) {
      hasMergedRef.current = true;
      mergeLocalCartWithServer(session.user.accessToken);
    }

    if (!isAuthenticated) {
      hasMergedRef.current = false;
    }

    prevSessionRef.current = session;
  }, [session, setJwt, mergeLocalCartWithServer]);

  return <>{children}</>;
}
