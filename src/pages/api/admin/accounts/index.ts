import type { NextApiRequest, NextApiResponse } from 'next'

import { getSession } from 'next-auth/react'

import { auth } from '@/libs/firebaseAdmin'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  if (!session || !session.user?.isAdmin) {
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
