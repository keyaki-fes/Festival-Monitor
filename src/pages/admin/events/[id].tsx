import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import type { NextPageWithLayout } from 'next'
import { useRouter } from 'next/router'

import {
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

const EventId: NextPageWithLayout = () => {
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
      .get(`/api/events/${id}`)
      .then((res) => {
        reset({
          name: res.data.name,
          organizer: res.data.organizer,
          location: res.data.location,
          startAt: dayjs(res.data.startAt).format('YYYY-MM-DDTHH:mm'),
          endAt: dayjs(res.data.endAt).format('YYYY-MM-DDTHH:mm'),
        })
      })
      .catch((err) => {
        toast.error('イベント情報の取得に失敗しました。')
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [router.isReady])

  const onSubmit = async (values: FormValues) => {
    await axios
      .post(`/api/events/${router.query.id}`, values)
      .then((res) => {
        toast.success('イベント情報を更新しました。')
        console.log(res)
      })
      .catch((err) => {
        toast.error('イベント情報の更新に失敗しました。')
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

      <Container maxW='container.lg' mt={8}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display='flex' flexDirection='column' gap={4}>
            <FormControl isInvalid={!!errors.name} isRequired>
              <FormLabel fontSize='sm' fontWeight='bold' color='gray.600'>
                イベント名
              </FormLabel>
              <InputGroup>
                <Input
                  type='text'
                  borderColor='gray.300'
                  {...register('name')}
                />
              </InputGroup>
              <FormErrorMessage fontSize='xs' color='red.500'>
                {errors.name?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.organizer}>
              <FormLabel fontSize='sm' fontWeight='bold' color='gray.600'>
                主催団体
              </FormLabel>
              <InputGroup>
                <Input
                  type='text'
                  borderColor='gray.300'
                  {...register('organizer')}
                />
              </InputGroup>
              <FormErrorMessage fontSize='xs' color='red.500'>
                {errors.organizer?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.location} isRequired>
              <FormLabel fontSize='sm' fontWeight='bold' color='gray.600'>
                開催場所
              </FormLabel>
              <InputGroup>
                <Input
                  type='text'
                  borderColor='gray.300'
                  {...register('location')}
                />
              </InputGroup>
              <FormErrorMessage fontSize='xs' color='red.500'>
                {errors.location?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.startAt} isRequired>
              <FormLabel fontSize='sm' fontWeight='bold' color='gray.600'>
                開始日時
              </FormLabel>
              <InputGroup>
                <Input
                  type='datetime-local'
                  borderColor='gray.300'
                  {...register('startAt')}
                />
              </InputGroup>
              <FormErrorMessage fontSize='xs' color='red.500'>
                {errors.startAt?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.endAt} isRequired>
              <FormLabel fontSize='sm' fontWeight='bold' color='gray.600'>
                終了日時
              </FormLabel>
              <InputGroup>
                <Input
                  type='datetime-local'
                  borderColor='gray.300'
                  {...register('endAt')}
                />
              </InputGroup>
              <FormErrorMessage fontSize='xs' color='red.500'>
                {errors.endAt?.message}
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
      </Container>
    </Container>
  )
}

EventId.getLayout = (page) => <Layout>{page}</Layout>

export default EventId
