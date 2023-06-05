import type { NextApiRequest, NextApiResponse } from 'next'

import { getToken } from 'next-auth/jwt'

import { auth } from '@/libs/firebaseAdmin'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as any
  // ログイン済みかつローカル環境の場合は、isAdminをtrueにする
  if (!token && location.hostname !== 'localhost') {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  switch (req.method) {
    case 'GET':
      try {
        auth.setCustomUserClaims(token.uid, { isAdmin: true })
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
