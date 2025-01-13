import NextAuth from 'next-auth';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signInWithCustomToken } from 'firebase/auth';
import { JWT } from 'next-auth/jwt';
import { auth } from './firebase';

export const authOptions: AuthOptions = {
  pages: {
    error: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        token: { label: 'Custom Token', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.token) return null;

        try {
          const userCredential = await signInWithCustomToken(
            auth,
            credentials.token
          );

          const accessToken = await userCredential.user.getIdToken();

          if (userCredential.user && accessToken) {
            return {
              accessToken: accessToken,
              id: userCredential.user.uid,
              email: userCredential.user.email,
              name: userCredential.user.displayName,
            };
          }
          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.accessToken = token.accessToken as JWT;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
