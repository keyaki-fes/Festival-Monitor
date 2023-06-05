import type { NextApiRequest, NextApiResponse } from 'next'

import { getToken } from 'next-auth/jwt'

import { auth } from '@/libs/firebaseAdmin'
import authOptions from '@/pages/api/auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = (await getToken({ req, secret: authOptions.secret })) as any
  if (!token || !token.isAdmin) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  switch (req.method) {
    case 'POST':
      try {
        const { email, password } = req.body
        await auth.createUser({
          email,
          password,
        })
        res.status(200).json({ message: 'Success' })
      } catch (error: any) {
        if (error.code === 'auth/email-already-exists') {
          res.status(409).json({ message: 'Email already exists' })
          return
        }
        res.status(500).json({ message: 'Internal Server Error' })
      }
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).json({ message: `Method ${req.method} Not Allowed` })
      break
  }
}
