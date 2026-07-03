// export { default } from "next-auth/middleware"
import {  withAuth } from 'next-auth/middleware';
import AllRoutes from './app/dashboard/_lib/routes';
import CONFIG from './config';
import { NextRequest, NextResponse } from 'next/server';

// const intlHomepageMiddleware = createIntlMiddleware({
//   LOCALES,
//   DEFAULT_LOCALE,
//   localePrefix: 'as-needed',
//   localeDetection: true
// });

export default withAuth(
  // function middleware(request: NextRequestWithAuth) {
  //   // Skip internationalization for dashboard pages and login page
  //   // if (request.nextUrl.pathname.startsWith('/dashboard')) {
  //   //   return intlHomepageMiddleware(request);
  //   //   // return NextResponse.next();
  //   // }
  //   // Handle internationalization for other pages
  //   return NextResponse.next();
  // },

  {
    pages: {
      signIn: CONFIG.LOGIN_PATH
    },
    callbacks: {
      authorized: async ({ token, req }: { token: any; req: NextRequest }) => {

        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          if (token) {
            const path = req.nextUrl.pathname;
            const jwt = token.accessToken;

            const route = AllRoutes.routes.find((item) => item.path == path);

            if (route) {
              if (route.permission != null) {
                const Authorized = await isAuthorized(route.permission, jwt);
                if (!Authorized) {
                  return false;
                }
              } else if (route.permission == null) {
                return true;
              }
            }
            return true;
          } else {
            return false;
          }
        }
        return true;
      }
    }
  }
);

async function isAuthorized(permission: string, jwt: string): Promise<boolean> {
  const apiResult = await fetch(CONFIG.API_BASEPATH + '/Auth/GetPermissionsOfCurrentUser', {
    headers: {
      Authorization: `Bearer ${jwt}`,
      credentials: 'include'
    },
    next: { revalidate: 4000 }
  });
  if (apiResult.ok) {
    const permissions = await apiResult.json();
    let result = permissions.findIndex((element: string) => element === permission);
    return result >= 0;
  } else {
    return false;
  }
}
