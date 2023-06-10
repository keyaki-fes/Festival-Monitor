import { useState, useEffect } from 'react'

import { NextPageWithLayout } from 'next'
import { useRouter } from 'next/router'

import {
  Box,
  Icon,
  Text,
  Button,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'

import axios from 'axios'
import dayjs from 'dayjs'
import { MdInsertChartOutlined, MdDownload, MdAddChart } from 'react-icons/md'

import Loading from '@/components/Loading'
import { Layout } from '@/layouts/Layout'

export type Event = {
  id: string
  name: string
  organizer?: string
  location: string
  startAt: string
  endAt: string
}

const EventIndex: NextPageWithLayout = () => {
  const router = useRouter()
  const [events, setEvents] = useState<Event[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    axios
      .get('/api/events')
      .then((res) => {
        setEvents(res.data.events)
        setIsLoading(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const handleCSVExport = () => {
    if (!events) return
    const csvHeader = [
      'イベント名',
      '主催団体',
      '開催場所',
      '開始時刻',
      '終了時刻',
    ].join(',')
    const csvData = events
      .map((event: any) => {
        return [
          event.name.replace(/,/g, '，'),
          (event?.organizer || '未設定').replace(/,/g, '，'),
          event.location.replace(/,/g, '，'),
          dayjs(event.startAt).format('YYYY/MM/DD HH:mm'),
          dayjs(event.endAt).format('YYYY/MM/DD HH:mm'),
        ].join(',')
      })
      .join('\n')
    const bom = new Uint8Array([0xef, 0xbb, 0xbf])
    const blob = new Blob([bom, csvHeader, '\n', csvData], {
      type: 'text/csv',
    })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.download = `イベント一覧.csv`
    a.href = url
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  }
  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <Container maxW='container.xl'>
        <Box display='flex' flexDirection='row' alignItems='center' mb={4}>
          <Icon as={MdInsertChartOutlined} boxSize={8} mr={2} />
          <Box>
            <Text fontSize='2xl' fontWeight='bold'>
              イベント管理
            </Text>
            <Text fontSize='sm' color='gray.600'>
              イベントの管理を行います。
            </Text>
          </Box>
        </Box>
        <Box display='flex' justifyContent='flex-end' mb={3} gap={2}>
          <Button
            colorScheme='gray'
            variant='ghost'
            size='sm'
            rounded='md'
            leftIcon={<MdDownload />}
            onClick={handleCSVExport}
          >
            エクスポート（CSV）
          </Button>
          <Button
            colorScheme='blue'
            size='sm'
            rounded='md'
            leftIcon={<MdAddChart />}
            onClick={() => router.push('/admin/events/create')}
          >
            イベント作成
          </Button>
        </Box>
        <TableContainer>
          <Table size='sm'>
            <Thead>
              <Tr>
                <Th>イベント名</Th>
                <Th>主催団体</Th>
                <Th>開催場所</Th>
                <Th>開始時刻</Th>
                <Th>終了時刻</Th>
              </Tr>
            </Thead>
            <Tbody>
              {events?.map((event: any) => (
                <Tr key={event.id}>
                  <Td>{event.name}</Td>
                  <Td>{event?.organizer}</Td>
                  <Td>{event.location}</Td>
                  <Td>{dayjs(event.startAt).format('YYYY/MM/DD HH:mm')}</Td>
                  <Td>{dayjs(event.endAt).format('YYYY/MM/DD HH:mm')}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>
    </>
  )
}

EventIndex.getLayout = (page) => {
  return <Layout>{page}</Layout>
}

export default EventIndex
