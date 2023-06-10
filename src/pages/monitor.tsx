import { useState, useEffect } from 'react'

import { Box, Text } from '@chakra-ui/react'

import axios from 'axios'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Tokyo')

import Loading from '@/components/Loading'
import { db } from '@/libs/firebaseAdmin'
import type { Booth } from '@/pages/admin/booths'
import type { Event } from '@/pages/admin/events'

const BoothCard = ({ booth }: { booth: Booth }) => {
  const statusToString = (
    status: 'open' | 'closed' | 'break' | 'preparing'
  ) => {
    if (status === 'open') {
      return '開催中'
    } else if (status === 'closed') {
      return '終了'
    } else if (status === 'break') {
      return '中断中'
    } else if (status === 'preparing') {
      return '準備中'
    }
  }
  const waitingTimeToColor = (waitingTime: number) => {
    if (waitingTime >= 30) {
      return '#EA3323'
    } else if (waitingTime >= 20) {
      return '#f7971e'
    } else if (waitingTime >= 10) {
      return '#16a34a'
    } else {
      return '#2952BD'
    }
  }
  return (
    <Box display='flex' flexDirection={'row'} gap={3} h={'6.25rem'} w='100%'>
      <Box
        flex={1}
        h={'100%'}
        bg='#1B1B23'
        borderRadius='10px'
        display='flex'
        px={4}
        alignItems='center'
        gap={8}
      >
        <Box
          w={'22rem'}
          h={'4rem'}
          ml={2}
          bg='#393939'
          borderRadius='10px'
          display='flex'
          flexDirection='row'
          justifyContent='center'
          alignItems='center'
          gap={1.5}
        >
          {booth.area && (
            <Text fontSize='1.65rem' color='white' fontWeight='bold'>
              {booth.area}
            </Text>
          )}

          {booth.floor && (
            <Text fontSize='1.65rem' color='white' fontWeight='bold'>
              {booth.floor}階
            </Text>
          )}

          <Text fontSize='1.65rem' color='white' fontWeight='bold'>
            {booth.location}
          </Text>
        </Box>
        <Box
          display='flex'
          flexDirection='column'
          alignItems='start'
          gap={1.5}
          flex={1}
        >
          <Text
            fontSize='2.25rem'
            color='white'
            fontWeight='bold'
            lineHeight={'100%'}
          >
            {booth.name}
          </Text>
          <Text
            fontSize='1.2rem'
            color='white'
            fontWeight='bold'
            lineHeight={'100%'}
            w={36}
          >
            {booth.organizer}
          </Text>
        </Box>
      </Box>
      <Box
        w={72}
        h={'100%'}
        bg={
          booth.status === 'open'
            ? waitingTimeToColor(booth.waiting)
            : '#1B1B23'
        }
        borderRadius='10px'
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        {booth.status === 'open' ? (
          <Text
            fontSize='2.8rem'
            color='white'
            textAlign='center'
            fontWeight='bold'
            lineHeight={'100%'}
          >
            {booth.waiting}
            {booth.waiting >= 30 ? (
              <Text
                fontSize='1.65rem'
                color='white'
                textAlign='center'
                fontWeight='bold'
                lineHeight={'100%'}
                as='span'
                ml={1}
              >
                分以上待ち
              </Text>
            ) : (
              <Text
                fontSize='1.65rem'
                color='white'
                textAlign='center'
                fontWeight='bold'
                lineHeight={'100%'}
                as='span'
                ml={1}
              >
                分待ち
              </Text>
            )}
          </Text>
        ) : (
          <Text
            fontSize='2.05rem'
            color='white'
            textAlign='center'
            fontWeight='bold'
            lineHeight={'100%'}
          >
            {statusToString(booth.status)}
          </Text>
        )}
      </Box>
    </Box>
  )
}

const EventCard = ({ event }: { event: Event }) => {
  return (
    <Box display='flex' flexDirection={'row'} gap={3} h={'5.5rem'}>
      <Box
        w={72}
        h={'100%'}
        bg='#1B1B23'
        borderRadius='10px'
        display='flex'
        justifyContent='center'
        px={4}
        alignItems='center'
        gap={8}
      >
        <Text
          fontSize='2rem'
          color='white'
          textAlign='center'
          fontWeight='bold'
          lineHeight={'100%'}
        >
          {dayjs(event.startAt).format('HH:mm')} ~{' '}
          {dayjs(event.endAt).format('HH:mm')}
        </Text>
      </Box>
      <Box
        w={'28rem'}
        h={'100%'}
        bg={'#1B1B23'}
        borderRadius='10px'
        display='flex'
        justifyContent='center'
        px={4}
        alignItems='center'
        gap={8}
      >
        <Text
          fontSize='2rem'
          color='white'
          textAlign='center'
          fontWeight='bold'
          lineHeight={'100%'}
        >
          {event.location}
        </Text>
      </Box>
      <Box
        flex={1}
        h={'100%'}
        bg='#1B1B23'
        borderRadius='10px'
        display='flex'
        justifyContent='center'
        px={4}
        alignItems='center'
        gap={8}
      >
        <Text
          fontSize='2.25rem'
          color='white'
          textAlign='center'
          fontWeight='bold'
          lineHeight={'100%'}
        >
          {event.name}
        </Text>
      </Box>
    </Box>
  )
}

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
    }, 1000 * 60 * 5)
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
    }, 1000 * 12)
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
                      <EventCard key={i} event={event} />
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
                      <BoothCard booth={booth} />
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
