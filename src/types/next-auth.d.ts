import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user?: {
      uid: string
      isAdmin: boolean
    } & DefaultSession['user']
  }

  interface JWT {
    uid: string
    isAdmin: boolean
  }
}
