import type { Account, NextAuthOptions, Profile, Session, User } from 'next-auth';
// import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import AuthenticationService from '@root/app/dashboard/(auth)/_service/AuthenticationService';
import { JWT } from 'next-auth/jwt';
import { AdapterUser } from 'next-auth/adapters';
import AccountService from '@root/app/dashboard/(auth)/_service/AccountService';
import CONFIG from '@root/config';

export const options: NextAuthOptions = {
  pages: {
    signIn: CONFIG.LOGIN_PATH,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: {
      token: JWT;
      user: User | AdapterUser;
      account: Account | null;
      profile?: Profile | null;
      trigger?: "signIn" | "signUp" | "update";
      isNewUser?: boolean;
      session?: Session;
    }): Promise<JWT> {
      if (user) {
        token.user = {
          id: user.id as number,
          name: user.name,
          userName: user.userName,
          email: user.email,
          defaultLanguage: user.defaultLanguage || CONFIG.DEFAULT_LANGUAGE,
          defaultTheme: user.defaultTheme || CONFIG.DASHBOARD_DEFAULT_THEME_MODE,
          avatar: user.avatar,
          roles: user.roles,
        };
        token.accessToken = user.accessToken;
      } 

      if (trigger === 'update' && session) {
        token.user = {
          id: session.user.id,
          name: session.user.name,
          userName: session.user.userName,
          email: session.user.email,
          defaultLanguage: session.user.defaultLanguage || CONFIG.DEFAULT_LANGUAGE,
          defaultTheme: session.user.defaultTheme || CONFIG.DASHBOARD_DEFAULT_THEME_MODE,
          avatar: session.user.avatar,
          roles: session.user.roles,
        };
        token.accessToken = session.user.accessToken;

        const accountService = new AccountService(session.user.accessToken);
        const newRefreshToken = await accountService.refreshToken();
        token.accessToken = newRefreshToken;
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT; user: AdapterUser }) {
      session.user = {
        ...session.user,
        ...(token.user as {
          name: string;
          userName: string;
          email: string;
          defaultLanguage: string;
          defaultTheme: 'light' | 'dark';
          avatar: string;
          roles: string[];
          id: number;
        }),
        accessToken: token.accessToken as string,
      };
      session.accessToken = token.accessToken as string;
      session.accessTokenExpires = token.accessTokenExpires as number;
      session.error = token.error as string;

      return session;
    }
  },
  providers: [
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID as string,
    //   clientSecret: process.env.GITHUB_SECRET as string
    // }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials): Promise<User | null> {
        const authenticationService = new AuthenticationService();
        var loginModel : LoginModel = {
          username : credentials?.username as string,
          password : credentials?.password as string,
          rememberMe : true
        }
        const result = await authenticationService.login(loginModel);
        
        return result.succeeded === true ? result.data ?? null : null;
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
};
