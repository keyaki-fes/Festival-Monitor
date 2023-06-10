import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import type { NextPageWithLayout } from 'next'

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
import { MdAddBusiness } from 'react-icons/md'
import { z } from 'zod'

import { Layout } from '@/layouts/Layout'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Tokyo')

export const schema = z.object({
  id: z.string().nonempty({ message: 'IDを入力してください。' }),
  name: z.string().nonempty({ message: '模擬店名を入力してください。' }),
  organizer: z.string().nonempty({ message: '主催団体名を入力してください。' }),
  location: z.string().nonempty({ message: '場所を入力してください。' }),
  floor: z.string(),
  area: z.string(),
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
      await axios.post('/api/admin/booths/create', values)
      toast.success('模擬店情報を作成しました。')
      reset()
    } catch (error: any) {
      console.log(error)
      if (error.response.status === 409) {
        toast.error('このIDは既に使用されています。')
      } else if (error.response.status === 404) {
        toast.error('存在しないIDが入力されました。')
      } else {
        toast.error('エラーが発生しました。')
      }
    }
  }

  return (
    <Container maxW='container.xl'>
      <Box display='flex' flexDirection='row' alignItems='center' mb={4}>
        <Icon as={MdAddBusiness} boxSize={8} mr={2} />
        <Box>
          <Text fontSize='2xl' fontWeight='bold'>
            模擬店情報作成
          </Text>
          <Text fontSize='sm' color='gray.600'>
            模擬店情報を作成します。
          </Text>
        </Box>
      </Box>
      <Alert status='info' mb={4} rounded='md' fontSize='sm'>
        <AlertIcon />
        IDは、作成したアカウントのUIDと同じものを入力してください。
      </Alert>
      <Container maxW='container.lg' mt={8}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display='flex' flexDirection='column' gap={4}>
            <FormControl isInvalid={!!errors.id} isRequired>
              <FormLabel fontSize='sm' fontWeight='bold' color='gray.600'>
                ID
              </FormLabel>
              <InputGroup>
                <Input type='text' borderColor='gray.300' {...register('id')} />
              </InputGroup>
              <FormErrorMessage fontSize='xs' color='red.500'>
                {errors.id?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.name} isRequired>
              <FormLabel fontSize='sm' fontWeight='bold' color='gray.600'>
                模擬店名
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
            <FormControl isInvalid={!!errors.organizer} isRequired>
              <FormLabel fontSize='sm' fontWeight='bold' color='gray.600'>
                主催団体名
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
                場所
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
            <FormControl isInvalid={!!errors.floor}>
              <FormLabel fontSize='sm' fontWeight='bold' color='gray.600'>
                フロア
              </FormLabel>
              <InputGroup>
                <Input
                  type='text'
                  borderColor='gray.300'
                  {...register('floor')}
                />
              </InputGroup>
              <FormErrorMessage fontSize='xs' color='red.500'>
                {errors.floor?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.area}>
              <FormLabel fontSize='sm' fontWeight='bold' color='gray.600'>
                エリア
              </FormLabel>
              <InputGroup>
                <Input
                  type='text'
                  borderColor='gray.300'
                  {...register('area')}
                />
              </InputGroup>
              <FormErrorMessage fontSize='xs' color='red.500'>
                {errors.area?.message}
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
