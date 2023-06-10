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
import { MdOutlinePlaylistAddCheck, MdOutlinePlaylistAdd } from 'react-icons/md'
import { RiPencilFill } from 'react-icons/ri'

import Loading from '@/components/Loading'
import { Layout } from '@/layouts/Layout'

export type Notice = {
  id: string
  text: string
  startAt: string
  endAt: string
}

const NoticeIndex: NextPageWithLayout = () => {
  const router = useRouter()
  const [notices, setNotices] = useState<Notice[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    axios
      .get('/api/admin/notices')
      .then((res) => {
        setNotices(res.data.notices)
        setIsLoading(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <Container maxW='container.xl'>
        <Box display='flex' flexDirection='row' alignItems='center' mb={4}>
          <Icon as={MdOutlinePlaylistAddCheck} boxSize={8} mr={2} />
          <Box>
            <Text fontSize='2xl' fontWeight='bold'>
              お知らせ管理
            </Text>
            <Text fontSize='sm' color='gray.600'>
              お知らせの管理を行います。
            </Text>
          </Box>
        </Box>
        <Box display='flex' justifyContent='flex-end' mb={3} gap={2}>
          <Button
            colorScheme='blue'
            size='sm'
            rounded='md'
            leftIcon={<MdOutlinePlaylistAdd />}
            onClick={() => router.push('/admin/notices/create')}
          >
            お知らせ作成
          </Button>
        </Box>
        <TableContainer>
          <Table size='sm'>
            <Thead>
              <Tr>
                <Th>お知らせ</Th>
                <Th>開始時刻</Th>
                <Th>終了時刻</Th>
                <Th>編集</Th>
              </Tr>
            </Thead>
            <Tbody>
              {notices?.map((notice: Notice) => (
                <Tr key={notice.id}>
                  <Td>{notice.text}</Td>
                  <Td>{dayjs(notice.startAt).format('YYYY/MM/DD HH:mm')}</Td>
                  <Td>{dayjs(notice.endAt).format('YYYY/MM/DD HH:mm')}</Td>
                  <Td>
                    <Icon
                      as={RiPencilFill}
                      boxSize={4}
                      cursor='pointer'
                      color='gray.600'
                      transition='all 0.2s'
                      _hover={{ color: 'gray.800' }}
                      onClick={() => router.push(`/admin/notices/${notice.id}`)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>
    </>
  )
}

NoticeIndex.getLayout = (page) => {
  return <Layout>{page}</Layout>
}

export default NoticeIndex
