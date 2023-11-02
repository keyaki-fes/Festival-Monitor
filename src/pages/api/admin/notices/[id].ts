import type { NextApiRequest, NextApiResponse } from 'next'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { getToken } from 'next-auth/jwt'

import { db } from '@/libs/firebaseAdmin'
import type { Notice } from '@/pages/admin/notices'
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
  const { id } = req.query
  if (typeof id !== 'string') {
    res.status(400).json({ message: 'Bad Request' })
    return
  }

  switch (req.method) {
    case 'GET':
      try {
        const doc = await db.collection('notices').doc(id).get()
        if (!doc.exists) {
          res.status(404).json({ message: 'Not Found' })
          return
        }
        const data = doc.data() as any
        const notice = {
          id: doc.id,
          text: data.text,
          startAt: dayjs(data.startAt.toDate()).tz().format('YYYY-MM-DDTHH:mm'),
          endAt: dayjs(data.endAt.toDate()).tz().format('YYYY-MM-DDTHH:mm'),
        } as Notice
        res.status(200).json(notice)
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
      break
    case 'POST':
      try {
        await db
          .collection('notices')
          .doc(id)
          .update({
            text: req.body.text,
            startAt: dayjs(req.body.startAt).tz().toDate(),
            endAt: dayjs(req.body.endAt).tz().toDate(),
          })
        res.status(200).json({ message: 'OK' })
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
      break
    case 'DELETE':
      try {
        await db.collection('notices').doc(id).delete()
        res.status(200).json({ message: 'OK' })
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
      res.status(405).json({ message: `Method ${req.method} Not Allowed` })
      break
  }
}
