import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import type { NextPageWithLayout } from 'next'

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
import { MdOutlinePlaylistAdd } from 'react-icons/md'
import { z } from 'zod'

import { Layout } from '@/layouts/Layout'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Tokyo')

export const schema = z
  .object({
    text: z.string().nonempty({ message: '本文を入力してください。' }),
    startAt: z.string().nonempty({ message: '日時を入力してください。' }),
    endAt: z.string().nonempty({ message: '日時を入力してください。' }),
  })
  .superRefine(({ startAt, endAt }, ctx) => {
    if (dayjs(startAt).isAfter(dayjs(endAt))) {
      ctx.addIssue({
        message: '開始日時が終了日時より後になっています。',
        path: ['endAt'],
        code: 'custom',
      })
    }
  })
  .superRefine(({ startAt, endAt }, ctx) => {
    if (dayjs(startAt).isSame(dayjs(endAt))) {
      ctx.addIssue({
        message: '開始日時と終了日時が同じです。',
        path: ['endAt'],
        code: 'custom',
      })
    }
  })

type FormValues = z.infer<typeof schema>

const Create: NextPageWithLayout = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (values: FormValues) => {
    try {
      await axios.post('/api/admin/notices/create', values)
      toast.success('お知らせを作成しました。')
      reset()
    } catch (error) {
      console.log(error)
      toast.error('エラーが発生しました。')
    }
  }

  return (
    <Container maxW='container.xl'>
      <Box display='flex' flexDirection='row' alignItems='center' mb={4}>
        <Icon as={MdOutlinePlaylistAdd} boxSize={8} mr={2} />
        <Box>
          <Text fontSize='2xl' fontWeight='bold'>
            お知らせ作成
          </Text>
          <Text fontSize='sm' color='gray.600'>
            お知らせを作成します。
          </Text>
        </Box>
      </Box>

      <Container maxW='container.lg' mt={8}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display='flex' flexDirection='column' gap={4}>
            <FormControl isInvalid={!!errors.text} isRequired>
              <FormLabel fontSize='sm' fontWeight='bold' color='gray.600'>
                本文
              </FormLabel>
              <InputGroup>
                <Input
                  type='text'
                  borderColor='gray.300'
                  {...register('text')}
                />
              </InputGroup>
              <FormErrorMessage fontSize='xs' color='red.500'>
                {errors.text?.message}
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
            作成
          </Button>
        </form>
      </Container>
    </Container>
  )
}

Create.getLayout = (page) => <Layout>{page}</Layout>

export default Create
