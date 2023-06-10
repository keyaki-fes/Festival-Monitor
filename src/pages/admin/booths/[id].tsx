import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import type { NextPageWithLayout } from 'next'
import { useRouter } from 'next/router'

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Icon,
  Text,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  FormErrorMessage,
} from '@chakra-ui/react'

import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { MdAddChart } from 'react-icons/md'
import { z } from 'zod'

import { schema } from './create'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Tokyo')
import Loading from '@/components/Loading'
import { Layout } from '@/layouts/Layout'

type FormValues = z.infer<typeof schema>

const BoothId: NextPageWithLayout = () => {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })
  useEffect(() => {
    if (!router.isReady) return
    const { id } = router.query
    axios
      .get(`/api/booths/${id}`)
      .then((res) => {
        reset({
          id: res.data.id,
          name: res.data.name,
          organizer: res.data.organizer,
          location: res.data.location,
          floor: res.data?.floor,
          area: res.data?.area,
        })
      })
      .catch((err) => {
        toast.error('模擬店情報の取得に失敗しました。')
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [router.isReady])

  const onSubmit = async (values: FormValues) => {
    await axios
      .post(`/api/booths/${router.query.id}`, values)
      .then((res) => {
        toast.success('模擬店情報を更新しました。')
        console.log(res)
      })
      .catch((err) => {
        toast.error('模擬店情報の更新に失敗しました。')
        console.error(err)
      })
  }

  const handleDelete = async () => {
    await axios
      .delete(`/api/booths/${router.query.id}`)
      .then((res) => {
        toast.success('模擬店情報を削除しました。')
        console.log(res)
      })
      .catch((err) => {
        toast.error('模擬店情報の削除に失敗しました。')
        console.error(err)
      })
  }

  if (loading) {
    return <Loading />
  }

  return (
    <Container maxW='container.xl'>
      <Box display='flex' flexDirection='row' alignItems='center' mb={4}>
        <Icon as={MdAddChart} boxSize={8} mr={2} />
        <Box>
          <Text fontSize='2xl' fontWeight='bold'>
            イベント更新
          </Text>
          <Text fontSize='sm' color='gray.600'>
            イベント情報を更新します。
          </Text>
        </Box>
      </Box>
      <Alert status='info' mb={4} rounded='md' fontSize='sm'>
        <AlertIcon />
        IDは変更できません。
      </Alert>
      <Container maxW='container.lg' mt={8}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display='flex' flexDirection='column' gap={4}>
            <FormControl isInvalid={!!errors.id} isReadOnly>
              <FormLabel htmlFor='id'>ID</FormLabel>
              <InputGroup>
                <Input
                  id='id'
                  placeholder='ID'
                  {...register('id')}
                  isReadOnly
                />
              </InputGroup>
              <FormErrorMessage>
                {errors.id && errors.id.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.name} isRequired>
              <FormLabel htmlFor='name'>模擬店名</FormLabel>
              <InputGroup>
                <Input id='name' placeholder='模擬店名' {...register('name')} />
              </InputGroup>
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.organizer} isRequired>
              <FormLabel htmlFor='organizer'>主催団体名</FormLabel>
              <InputGroup>
                <Input
                  id='organizer'
                  placeholder='主催団体名'
                  {...register('organizer')}
                />
              </InputGroup>
              <FormErrorMessage>
                {errors.organizer && errors.organizer.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.location} isRequired>
              <FormLabel htmlFor='location'>場所</FormLabel>
              <InputGroup>
                <Input
                  id='location'
                  placeholder='場所'
                  {...register('location')}
                />
              </InputGroup>
              <FormErrorMessage>
                {errors.location && errors.location.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.floor}>
              <FormLabel htmlFor='floor'>フロア</FormLabel>
              <InputGroup>
                <Input id='floor' placeholder='フロア' {...register('floor')} />
              </InputGroup>
              <FormErrorMessage>
                {errors.floor && errors.floor.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.area}>
              <FormLabel htmlFor='area'>エリア</FormLabel>
              <InputGroup>
                <Input id='area' placeholder='エリア' {...register('area')} />
              </InputGroup>
              <FormErrorMessage>
                {errors.area && errors.area.message}
              </FormErrorMessage>
            </FormControl>
          </Box>

          <Button
            type='submit'
            colorScheme='blue'
            variant='solid'
            width='100%'
            mt={8}
            disabled={!isValid || isSubmitting}
            isLoading={isSubmitting}
          >
            更新
          </Button>
        </form>
        <Button mt={4} onClick={handleDelete} colorScheme='red' width='full'>
          削除
        </Button>
      </Container>
    </Container>
  )
}

BoothId.getLayout = (page) => <Layout>{page}</Layout>

export default BoothId
