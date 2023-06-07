import { useState } from 'react'
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
  Alert,
  AlertIcon,
  InputRightElement,
} from '@chakra-ui/react'

import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'
import { MdPersonAddAlt1 } from 'react-icons/md'
import { z } from 'zod'

import { Layout } from '@/layouts/Layout'

const schema = z
  .object({
    email: z
      .string()
      .nonempty({ message: 'メールアドレスを入力してください。' })
      .email(),
    password: z
      .string()
      .nonempty({ message: 'パスワードを入力してください。' })
      .min(6, { message: 'パスワードは6文字以上で入力してください。' }),
    passwordConfirmation: z
      .string()
      .nonempty({ message: 'パスワードを入力してください。' })
      .min(6, { message: 'パスワードは6文字以上で入力してください。' }),
  })
  .superRefine(({ password, passwordConfirmation }) => {
    if (password !== passwordConfirmation) {
      return {
        message: 'パスワードが一致しません。',
        path: ['passwordConfirmation'],
      }
    }
  })

type FormValues = z.infer<typeof schema>

const Create: NextPageWithLayout = () => {
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isPasswordConfirmationShown, setIsPasswordConfirmationShown] =
    useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  })
  const onSubmit = async (data: FormValues) => {
    await axios
      .post('/api/admin/accounts/create', {
        email: data.email,
        password: data.password,
      })
      .then((res) => {
        toast.success('アカウントを作成しました。')
        reset()
        console.log(res)
      })
      .catch((err) => {
        if (err.response.status === 409) {
          toast.error('このメールアドレスは既に使用されています。')
        } else {
          toast.error('エラーが発生しました。')
        }
        console.log(err)
      })
  }
  return (
    <Container maxW='container.xl'>
      <Box display='flex' flexDirection='row' alignItems='center' mb={4}>
        <Icon as={MdPersonAddAlt1} boxSize={8} mr={2} />
        <Box>
          <Text fontSize='2xl' fontWeight='bold'>
            アカウント作成
          </Text>
          <Text fontSize='sm' color='gray.600'>
            アカウントを作成します。
          </Text>
        </Box>
      </Box>
      <Alert status='info' mb={4} rounded='md' fontSize='sm'>
        <AlertIcon />
        作成するアカウントのメールアドレスとパスワードを入力してください。
        パスワードは6文字以上で入力してください。
      </Alert>
      <Container maxW='container.lg' mt={8}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display='flex' flexDirection='column' gap={4}>
            <FormControl isInvalid={!!errors.email} isRequired>
              <FormLabel fontSize='sm' fontWeight='bold' color='gray.600'>
                メールアドレス
              </FormLabel>
              <InputGroup>
                <Input
                  type='email'
                  borderColor='gray.300'
                  {...register('email')}
                />
              </InputGroup>
              <FormErrorMessage fontSize='xs' color='red.500'>
                {errors['email']?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password} isRequired>
              <FormLabel fontSize='sm' fontWeight='bold' color='gray.600'>
                パスワード
              </FormLabel>
              <InputGroup>
                <Input
                  borderColor='gray.300'
                  type={isPasswordShown ? 'text' : 'password'}
                  {...register('password')}
                />
                <InputRightElement>
                  <Button
                    onClick={() => {
                      setIsPasswordShown(!isPasswordShown)
                    }}
                    bg='none'
                    _hover={{ bg: 'none' }}
                    _active={{ bg: 'none' }}
                    size='sm'
                  >
                    {isPasswordShown ? (
                      <AiFillEye> </AiFillEye>
                    ) : (
                      <AiFillEyeInvisible></AiFillEyeInvisible>
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage fontSize='xs' color='red.500'>
                {errors['password']?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.passwordConfirmation} isRequired>
              <FormLabel fontSize='sm' fontWeight='bold' color='gray.600'>
                パスワード（確認）
              </FormLabel>
              <InputGroup>
                <Input
                  borderColor='gray.300'
                  type={isPasswordConfirmationShown ? 'text' : 'password'}
                  {...register('passwordConfirmation')}
                />
                <InputRightElement>
                  <Button
                    onClick={() => {
                      setIsPasswordConfirmationShown(
                        !isPasswordConfirmationShown
                      )
                    }}
                    bg='none'
                    _hover={{ bg: 'none' }}
                    _active={{ bg: 'none' }}
                    size='sm'
                  >
                    {isPasswordConfirmationShown ? (
                      <AiFillEye> </AiFillEye>
                    ) : (
                      <AiFillEyeInvisible></AiFillEyeInvisible>
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage fontSize='xs' color='red.500'>
                {errors['passwordConfirmation']?.message}
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
