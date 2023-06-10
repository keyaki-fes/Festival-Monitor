import type { NextApiRequest, NextApiResponse } from 'next'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { getToken } from 'next-auth/jwt'

import { db } from '@/libs/firebaseAdmin'
import type { Notice } from '@/pages/admin/notices'
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
        const notices = await db.collection('notices').get()
        const noticesData = notices.docs.map((notice) => {
          const data = notice.data()
          return {
            id: notice.id,
            text: data.text,
            startAt: dayjs(data.startAt.toDate())
              .tz()
              .format('YYYY-MM-DDTHH:mm'),
            endAt: dayjs(data.endAt.toDate()).tz().format('YYYY-MM-DDTHH:mm'),
          } as Notice
        })
        noticesData.sort((a, b) => {
          if (a.startAt < b.startAt) {
            return -1
          }
          if (a.startAt > b.startAt) {
            return 1
          }
          return 0
        })
        res.status(200).json({ notices: noticesData })
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
