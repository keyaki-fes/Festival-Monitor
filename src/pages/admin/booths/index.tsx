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
import { MdEventNote, MdBookmarkAdd } from 'react-icons/md'
import { RiPencilFill } from 'react-icons/ri'

import Loading from '@/components/Loading'
import { Layout } from '@/layouts/Layout'

export type Booth = {
  id: string
  name: string
  organizer: string
  location: string
  floor?: string
  area?: string
  status: 'open' | 'closed' | 'break' | 'preparing'
  waiting: number
}

const BoothIndex: NextPageWithLayout = () => {
  const [booths, setBooths] = useState<Booth[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  useEffect(() => {
    axios
      .get('/api/booths')
      .then((res) => {
        setBooths(res.data.booths)
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
          <Icon as={MdEventNote} boxSize={8} mr={2} />
          <Box>
            <Text fontSize='2xl' fontWeight='bold'>
              模擬店管理
            </Text>
            <Text fontSize='sm' color='gray.600'>
              模擬店の管理を行います。
            </Text>
          </Box>
        </Box>
        <Box display='flex' justifyContent='flex-end' mb={3} gap={2}>
          <Button
            colorScheme='blue'
            size='sm'
            rounded='md'
            leftIcon={<MdBookmarkAdd />}
            onClick={() => router.push('/admin/booths/create')}
          >
            イベント作成
          </Button>
        </Box>
        <TableContainer>
          <Table size='sm'>
            <Thead>
              <Tr>
                <Th>模擬店名</Th>
                <Th>主催団体</Th>
                <Th>開催場所</Th>
                <Th>フロア</Th>
                <Th>エリア</Th>
                <Th>ステータス</Th>
                <Th>待ち時間</Th>
                <Th>編集</Th>
              </Tr>
            </Thead>
            <Tbody>
              {booths?.map((booth: Booth) => (
                <Tr key={booth.id}>
                  <Td>{booth.name}</Td>
                  <Td>{booth.organizer}</Td>
                  <Td>{booth.location}</Td>
                  <Td>{booth?.floor}</Td>
                  <Td>{booth?.area}</Td>
                  <Td>{booth.status}</Td>
                  <Td>{booth.waiting}</Td>
                  <Td>
                    <Icon
                      as={RiPencilFill}
                      boxSize={4}
                      cursor='pointer'
                      color='gray.600'
                      transition='all 0.2s'
                      _hover={{ color: 'gray.800' }}
                      onClick={() => router.push(`/admin/booths/${booth.id}`)}
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

BoothIndex.getLayout = (page) => {
  return <Layout>{page}</Layout>
}

export default BoothIndex
