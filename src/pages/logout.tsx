import { useEffect } from 'react'

import { useRouter } from 'next/router'

import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'

const Logout = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  useEffect(() => {
    if (status === 'loading') return
    if (session) {
      signOut()
    }
    router.push('/login')
  }, [status, router])
  return <></>
}

export default Logout
