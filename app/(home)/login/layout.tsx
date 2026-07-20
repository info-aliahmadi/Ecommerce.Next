'use client';

import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        // Ensure i18n is initialized for the login page

    }, []);

    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
} 