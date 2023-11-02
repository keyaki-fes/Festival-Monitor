import type { NextApiRequest, NextApiResponse } from 'next'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { getToken } from 'next-auth/jwt'

import { db } from '@/libs/firebaseAdmin'
//import authOptions from '@/pages/api/auth/[...nextauth]'
import { Booth } from '@/types/booth'

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
