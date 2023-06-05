import type { NextApiRequest, NextApiResponse } from 'next'

import { getSession } from 'next-auth/react'

import { auth } from '@/libs/firebaseAdmin'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // localhostからのアクセスのみ許可
  if (
    process.env.NODE_ENV === 'development' &&
    req.headers.host !== 'localhost:3000'
  ) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  const session = await getSession({ req })
  if (!session) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const uid = session?.user?.uid
  if (!uid) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  switch (req.method) {
    case 'GET':
      try {
        auth.setCustomUserClaims(uid, { isAdmin: true })
        res.status(200).json({ message: 'Success' })
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
