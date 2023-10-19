import type { NextApiRequest, NextApiResponse } from 'next'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { getToken } from 'next-auth/jwt'

import { db } from '@/libs/firebaseAdmin'
import type { Booth } from '@/pages/admin/booths'
import authOptions from '@/pages/api/auth/[...nextauth]'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Tokyo')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = (await getToken({ req, secret: authOptions.secret })) as any
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  const id = token?.uid
  if (!id) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  switch (req.method) {
    case 'GET':
      try {
        const doc = await db.collection('booths').doc(id).get()
        if (!doc.exists) {
          res.status(404).json({ message: 'Not Found' })
          return
        }
        const data = doc.data() as any
        const booth = {
          id: doc.id,
          name: data.name,
          organizer: data?.organizer,
          location: data.location,
          floor: data?.floor,
          area: data?.area,
          status: data.status,
          waiting: data.waiting,
        } as Booth
        res.status(200).json(booth)
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
      break
    case 'POST':
      try {
        await db.collection('booths').doc(id).update({
          status: req.body.status,
          waiting: req.body.waiting,
          memo: req.body.memo,
        })
        res.status(200).json({ message: 'OK' })
      } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).json({ message: `Method ${req.method} Not Allowed` })
      break
  }
}
