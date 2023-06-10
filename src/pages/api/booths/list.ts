import type { NextApiRequest, NextApiResponse } from 'next'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { db } from '@/libs/firebaseAdmin'
import type { Booth } from '@/pages/admin/booths'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Tokyo')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const booths = await db.collection('booths').get()
        const boothsData = booths.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            name: data.name,
            organizer: data.organizer,
            location: data.location,
            floor: data?.floor,
            area: data?.area,
            status: data.status,
            waiting: data.waiting,
          } as Booth
        })
        res.status(200).json({ booths: boothsData })
      } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
      }
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).json({ message: `Method ${req.method} Not Allowed` })
      break
  }
}
