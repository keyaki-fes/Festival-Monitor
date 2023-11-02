import type { NextApiRequest, NextApiResponse } from 'next'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { getToken } from 'next-auth/jwt'

import { db } from '@/libs/firebaseAdmin'
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
        db.collection('events').add({
          name: req.body.name,
          organizer: req.body.organizer ?? null,
          location: req.body.location,
          startAt: dayjs(req.body.startAt).tz().toDate(),
          endAt: dayjs(req.body.endAt).tz().toDate(),
        })
        res.status(200).json({ message: 'Success' })
      } catch (error: any) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).json({ message: `Method ${req.method} Not Allowed` })
      break
  }
}
