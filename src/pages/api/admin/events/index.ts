import type { NextApiRequest, NextApiResponse } from 'next'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { getToken } from 'next-auth/jwt'

import { db } from '@/libs/firebaseAdmin'
import type { Event } from '@/pages/admin/events'
import authOptions from '@/pages/api/auth/[...nextauth]'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Tokyo')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = (await getToken({ req, secret: authOptions.secret })) as any
  if (!token || !token.isAdmin) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  switch (req.method) {
    case 'GET':
      try {
        const events = await db.collection('events').get()
        const eventsData = events.docs.map((event) => {
          const data = event.data()
          return {
            id: event.id,
            name: data.name,
            organizer: data?.organizer ?? '',
            location: data.location,
            startAt: dayjs(data.startAt.toDate())
              .tz()
              .format('YYYY-MM-DDTHH:mm'),
            endAt: dayjs(data.endAt.toDate()).tz().format('YYYY-MM-DDTHH:mm'),
          } as Event
        })
        eventsData.sort((a, b) => {
          if (a.startAt < b.startAt) {
            return -1
          }
          if (a.startAt > b.startAt) {
            return 1
          }
          return 0
        })
        res.status(200).json({ events: eventsData })
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
