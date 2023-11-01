// https://zenn.dev/elpnt/articles/1af1047612992d
// かなり適当に書いているので直したい...

import NextAuth from 'next-auth'

import CredentialsProvider from 'next-auth/providers/credentials'

import { firebaseAdmin } from '@/libs/firebaseAdmin'

export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const { token } = credentials as any
        if (token != null) {
          try {
            const decoded = await firebaseAdmin.auth().verifyIdToken(token)
            console.log(decoded)
            return { ...decoded }
          } catch (error) {
            console.log('Failed to verify ID token:', error)
            return null
          }
        }
        return null
      },
    }),
  ],
  secret: process.env.NEXT_PUBLIC_VERCEL_SECRET,
  session: { strategy: 'jwt' },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token = { ...token, ...user }
      }
      return token
    },
    session: async ({ session, token }) => {
      session = {
        user: {
          uid: token.uid as string,
          email: token.email as string,
          isAdmin: token.isAdmin as boolean,
        },
        expires: session.expires,
      }
      return session
    },
  },
})
