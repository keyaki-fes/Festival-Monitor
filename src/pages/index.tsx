import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { NextPageWithLayout } from 'next'
import { useRouter } from 'next/router'

import { Container, Box, Text, Select, Button } from '@chakra-ui/react'

import axios from 'axios'

import Loading from '@/components/Loading'
import { Layout } from '@/layouts/Layout'

const Home: NextPageWithLayout = () => {
  const [data, setData] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('')
  const [waiting, setWaiting] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return
    axios
      .get(`/api/booths`)
      .then((res) => {
        setData(res.data)
        setStatus(res.data.status)
        setWaiting(res.data.waiting)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        if (err.response.status === 404) {
          setError('このアカウントに紐づけられた模擬店がありません')
        } else {
          setError('エラーが発生しました')
        }
        setIsLoading(false)
      })
  }, [router.isReady])

  const handleUpdate = async () => {
    setIsSubmitting(true)
    await axios
      .post(`/api/booths`, {
        status: status,
        waiting: status === 'open' ? waiting : 0,
      })
      .then((res) => {
        setIsSubmitting(false)
        toast.success('模擬店情報を更新しました')
        console.log(res.data)
      })
      .catch((err) => {
        console.error(err)
        toast.error('エラーが発生しました')
      })
  }
  if (isLoading) {
    return <Loading />
  }
  if (error) {
    return (
      <Text
        color='gray.700'
        mt={4}
        fontSize='md'
        fontWeight='bold'
        textAlign='center'
      >
        {error}
      </Text>
    )
  }
  return (
    <>
      <Container maxW='container.lg' mt={8}>
        <Box
          bg='white'
          py={4}
          px={6}
          borderRadius='md'
          border='1px solid'
          borderColor='gray.200'
          display='flex'
          flexDirection='column'
          alignItems='start'
          gap={1}
        >
          <Text fontSize='xl' fontWeight='bold'>
            模擬店情報
          </Text>
          <Box h='1px' w='100%' bg='gray.200' mb={2} />
          <Box display='flex' flexDirection='row' alignItems='center' gap={3}>
            <Box bg='blue.100' rounded='full' w='32' py={1}>
              <Text
                fontSize='0.95rem'
                fontWeight='bold'
                textAlign='center'
                color='blue.600'
              >
                模擬店名
              </Text>
            </Box>
            <Text fontSize='md' fontWeight='bold'>
              {data.name}
            </Text>
          </Box>
          <Box display='flex' flexDirection='row' alignItems='center' gap={3}>
            <Box bg='blue.100' rounded='full' w='32' py={1}>
              <Text
                fontSize='0.95rem'
                fontWeight='bold'
                textAlign='center'
                color='blue.600'
              >
                団体名
              </Text>
            </Box>
            <Text fontWeight='bold'>{data.organizer}</Text>
          </Box>
          <Box h='1px' w='100%' bg='gray.200' my={2} />
          <Box
            display='flex'
            flexDirection='column'
            alignItems='start'
            gap={1}
            width='100%'
          >
            <Text fontSize='0.9rem' fontWeight='bold' color='gray.600'>
              ステータス
            </Text>
            <Select
              value={status}
              size='sm'
              rounded='md'
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value='open'>開店</option>
              <option value='closed'>閉店</option>
              <option value='preparing'>準備中</option>
              <option value='break'>中断中</option>
            </Select>
          </Box>
          {status === 'open' && (
            <Box
              display='flex'
              flexDirection='column'
              alignItems='start'
              gap={1}
              width='100%'
            >
              <Text fontSize='0.9rem' fontWeight='bold' color='gray.600'>
                待ち時間
              </Text>
              <Select
                value={waiting}
                size='sm'
                rounded='md'
                onChange={(e) => setWaiting(Number(e.target.value))}
              >
                <option value={0}>0分</option>
                <option value={5}>5分</option>
                <option value={10}>10分</option>
                <option value={15}>15分</option>
                <option value={20}>20分</option>
                <option value={25}>25分</option>
                <option value={30}>30分以上</option>
              </Select>
            </Box>
          )}
          <Button
            colorScheme='blue'
            mt={4}
            width='100%'
            size='sm'
            isLoading={isSubmitting}
            onClick={handleUpdate}
          >
            更新
          </Button>
        </Box>
      </Container>
    </>
  )
}

Home.getLayout = (page) => <Layout>{page}</Layout>

export default Home
