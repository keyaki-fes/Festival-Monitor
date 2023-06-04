declare module 'next-auth' {
  interface Session {
    uid: string
    email: string
    isAdmin: boolean
  }
}
