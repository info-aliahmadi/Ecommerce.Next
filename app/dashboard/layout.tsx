"use client"
// types
import { Provider as ReduxProvider } from 'react-redux';
import DashboardThemeCustomization from '@root/app/dashboard/_theme';
import DashboardLayout from './_layout/Index';
import { store } from '@root/store';
import { Suspense, useEffect, useState } from 'react';
import Loader from './_components/Loader';
import { SessionProvider } from 'next-auth/react'
import AuthorizationProvider from './_components/Authorization/AuthorizationProvider';
import '@root/utils/extensions/numberExtensions';
import '@root/public/css/customStyle/dashboard.css'

// Client-side wrapper to prevent hydration issues
function ClientOnly({ children }: { children: any }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <Loader />;
  }

  return children;
}

// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardThemeLayout({ children }: { children: any }) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <ClientOnly>
          <Suspense fallback={<Loader />}>
            <Suspense fallback={<Loader />}>
              <AuthorizationProvider>
                <Suspense fallback={<Loader />}>
                  <DashboardThemeCustomization>
                    <DashboardLayout>
                      {children}
                    </DashboardLayout>
                  </DashboardThemeCustomization>
                </Suspense>
              </AuthorizationProvider>
            </Suspense>
          </Suspense>
        </ClientOnly>
      </ReduxProvider>
    </SessionProvider>
    /* <link rel="preconnect" href="https://fonts.gstatic.com" /> */
    /* <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap&family=Gloock:wght@400;500;600;700"
          rel="stylesheet"
        /> */

  );
}
