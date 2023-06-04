// https://zenn.dev/elpnt/articles/1af1047612992d

import NextAuth from 'next-auth'

import CredentialsProvider from 'next-auth/providers/credentials'

import { firebaseAdmin } from '@/libs/firebaseAdmin'

export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        console.log('credentials', credentials)
        const { token } = credentials as any
        if (token != null) {
          try {
            const decoded = await firebaseAdmin.auth().verifyIdToken(token)
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
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token = user as any
      }
      return token
    },
  },
})
