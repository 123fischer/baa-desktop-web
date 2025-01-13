import NextAuth, { DefaultSession } from 'next-auth';
import type { Locales } from 'types/types';
import type { Permission, Customer } from 'types/auth/auth';

declare module 'next-auth' {
  interface Session {
    accessToken: JWT;
    error: unknown;
  }
}
