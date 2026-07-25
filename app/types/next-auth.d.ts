import 'next-auth';
import {DefaultSession} from 'next-auth';
import {DefaultJWT} from 'next-auth/jwt';
import CurrencyTypes from './enums/CurrencyTypes';
import ThemeType from './enums/ThemeType';
import LanguageType from './enums/LanguageType';

declare module 'next-auth' {
  interface User {
    id: number;
    email?: string;
    phoneNumber?: string;
    name: string;
    userName?: string;
    avatar: string;
    defaultLanguage: LanguageType;
    defaultTheme: ThemeType;
    roles: Array<string>;
    accessToken: string;
    accessTokenExpires: number;
  }

  interface Session extends DefaultSession {
    user: User;
    expires: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error: string;
  }
}
