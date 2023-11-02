import type { NextApiRequest, NextApiResponse } from 'next'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { getToken } from 'next-auth/jwt'

import { db, auth } from '@/libs/firebaseAdmin'
//import authOptions from '@/pages/api/auth/[...nextauth]'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Tokyo')

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
    case 'POST':
      try {
        if (!req.body.id) {
          res.status(400).json({ message: 'Invalid id' })
          return
        }
        await auth.getUser(req.body.id)
        const docRef = await db.collection('booths').doc(req.body.id).get()
        if (docRef.exists) {
          res.status(409).json({ message: 'Booth already exists' })
          return
        }
        await db.collection('booths').doc(req.body.id).set(
          {
            name: req.body.name,
            organizer: req.body.organizer,
            location: req.body.location,
            floor: req.body?.floor,
            area: req.body?.area,
            status: 'preparing',
            waiting: 0,
          },
          { merge: false }
        )
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
      res.setHeader('Allow', ['POST'])
      res.status(405).json({ message: `Method ${req.method} Not Allowed` })
      break
  }
}
