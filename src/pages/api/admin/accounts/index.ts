import type { NextApiRequest, NextApiResponse } from 'next'

import { getToken } from 'next-auth/jwt'

import { auth } from '@/libs/firebaseAdmin'
//import authOptions from '@/pages/api/auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = (await getToken({
    req,
    secret: process.env.NEXT_PUBLIC_VERCEL_SECRET,
  })) as any
  if (!token || !token.isAdmin) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  switch (req.method) {
    case 'GET':
      try {
        const listUsersResult = await auth.listUsers()
        res.status(200).json({ users: listUsersResult.users })
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).json({ message: `Method ${req.method} Not Allowed` })
      break
  }
}
