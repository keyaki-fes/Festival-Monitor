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

  const { id } = req.query
  if (!id || Array.isArray(id) || id === token.uid) {
    res.status(400).json({ message: 'Bad Request' })
    return
  }
  switch (req.method) {
    case 'GET':
      try {
        const user = await auth.getUser(id)
        res.status(200).json({ user })
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          res.status(404).json({ message: 'User not found' })
          return
        }
        res.status(500).json({ message: 'Internal Server Error' })
      }
      break
    case 'POST':
      try {
        const { isAdmin } = req.body
        if (typeof isAdmin !== 'boolean') {
          res.status(400).json({ message: 'Bad Request' })
          return
        }
        if (isAdmin) {
          await auth.setCustomUserClaims(id, { isAdmin: true })
        } else {
          await auth.setCustomUserClaims(id, { isAdmin: null })
        }
        res.status(200).json({ message: 'Success' })
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          res.status(404).json({ message: 'User not found' })
          return
        }
        res.status(500).json({ message: 'Internal Server Error' })
      }
      break
    case 'DELETE':
      try {
        if (id !== token.id) {
          await auth.deleteUser(id)
        } else {
          res.status(400).json({ message: 'Bad Request' })
          return
        }
        res.status(200).json({ message: 'Success' })
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          res.status(404).json({ message: 'User not found' })
          return
        }
        res.status(500).json({ message: 'Internal Server Error' })
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).json({ message: `Method ${req.method} Not Allowed` })
      break
  }
}
