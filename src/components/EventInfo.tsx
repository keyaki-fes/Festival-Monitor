import { Box, Text } from '@chakra-ui/react'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Tokyo')
import { Event } from '@/types/event'

const EventInfo = ({ event }: { event: Event }) => {
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

export default EventInfo
