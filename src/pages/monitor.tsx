import { useState, useEffect } from 'react'

import { Box, Text } from '@chakra-ui/react'

import axios from 'axios'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Tokyo')

import BoothInfo from '@/components/BoothInfo'
import EventInfo from '@/components/EventInfo'
import Loading from '@/components/Loading'
import { monitorSettings } from '@/libs/constants'
import { db } from '@/libs/firebaseAdmin'
import { Booth } from '@/types/booth'
import { Event } from '@/types/event'


export default function Home({ events }: { events: Event[] }) {
  const [loading, setLoading] = useState<boolean>(true)
  const [index, setIndex] = useState<number>(0)
  const [notices, setNotices] = useState<string[] | null>([])
  const [booths, setBooths] = useState<Booth[] | null>(null)

  //今後行われるイベントのみを抽出
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])

  const getUpcomingEvents = async () => {
    const now = dayjs()
    const upcomingEvents = events.filter((event) => {
      return dayjs(event.startAt).isAfter(now)
    })
    setUpcomingEvents(upcomingEvents)
  }

  const getNotices = async () => {
    await axios
      .get('/api/notices')
      .then((res) => {
        const notices = res.data.notices.map((notice: any) => notice.text)
        setNotices(notices)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const getBooths = async () => {
    await axios
      .get('/api/booths/list')
      .then((res) => {
        const booths = res.data.booths
        booths.sort((a: any, b: any) => {
          if (a.organizer < b.organizer) {
            return -1
          } else {
            return 1
          }
        })
        setBooths(booths)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    getNotices()
    getBooths()
    getUpcomingEvents()
    setLoading(false)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      getNotices()
      getBooths()
      getUpcomingEvents()
    }, 1000 * 60 * monitorSettings.refreshInterval)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index) => {
        if (loading || !booths) {
          return 0
        }
        if (index == Math.ceil(booths.length / 7)) {
          return 0
        }
        return index + 1
      })
    }, 1000 * monitorSettings.duration)
    return () => clearInterval(interval)
  }, [booths])

  if (loading || !booths) {
    return <Loading />
  }

  return (
    <>
      <main>
        <Box w='100%' h='100vh'>
          <Box
            w='100%'
            h='93vh'
            bg='#f5f5f5'
            px={2}
            py={4}
            display='flex'
            flexDirection='column'
            justifyContent='start'
            gap={3}
          >
            {index == Math.ceil(booths.length / 7) && (
              <>
                {upcomingEvents.length == 0 ? (
                  <Text
                    fontSize='2xl'
                    color='black'
                    textAlign='center'
                    fontWeight='bold'
                  >
                    今後開始されるイベントはありません
                  </Text>
                ) : (
                  <>
                    {upcomingEvents.slice(0, 7).map((event: any, i: any) => (
                      <EventInfo key={i} event={event} />
                    ))}
                  </>
                )}
              </>
            )}
            {index != Math.ceil(booths.length / 7) && (
              <>
                {booths
                  ?.slice(index * 7, index * 7 + 7)
                  .map((booth: Booth, i: any) => (
                    <div key={i}>
                      <BoothInfo booth={booth} />
                    </div>
                  ))}
              </>
            )}
          </Box>
          <Box
            h='7vh'
            bg='#1B1B23'
            display='flex'
            justifyContent='start'
            alignItems='center'
            width='100%'
          >
            <Box width='100%' overflow='hidden' position='relative'>
              <Text
                display='inline-block'
                fontSize='1.75rem'
                color='white'
                fontWeight='bold'
                animation={`flowText ${
                  (notices?.join(
                    '　　　　　　　　　　　　　　　　　　　　　　　'
                  ).length || 5) *
                    0.3 +
                    5 || 10
                }s linear infinite`}
                pl='100%'
                whiteSpace={'nowrap'}
                sx={{
                  '@keyframes flowText': {
                    '0%': {
                      transform: 'translateX(0)',
                    },
                    '100%': {
                      transform: 'translateX(-100%)',
                    },
                  },
                }}
              >
                {notices?.join(
                  '　　　　　　　　　　　　　　　　　　　　　　　'
                )}
              </Text>
            </Box>
          </Box>
        </Box>
      </main>
    </>
  )
}

export async function getStaticProps() {
  const snapshot = await db.collection('events').get()
  let events = snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      name: data.name,
      location: data.location,
      startAt: dayjs(data.startAt.toDate())
        .tz('Asia/Tokyo')
        .format('YYYY/MM/DD HH:mm'),
      endAt: dayjs(data.endAt.toDate())
        .tz('Asia/Tokyo')
        .format('YYYY/MM/DD HH:mm'),
    }
  })
  events = events.sort((a: any, b: any) => {
    if (a.startAt > b.startAt) {
      return 1
    } else {
      return -1
    }
  })

  return {
    props: {
      events,
    },
  }
}
