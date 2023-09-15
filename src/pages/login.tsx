import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { useRouter } from 'next/router'

import { Link } from '@chakra-ui/next-js'
import {
  Alert,
  AlertIcon,
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Container,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
} from '@chakra-ui/react'

import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { signIn } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { z } from 'zod'

import { festivalName, administrator } from '@/libs/constants'
import { auth } from '@/libs/firebase'

const schema = z.object({
  email: z
    .string()
    .nonempty({ message: 'メールアドレスを入力してください。' })
    .email(),
  password: z
    .string()
    .nonempty({ message: 'パスワードを入力してください。' })
    .min(6, { message: 'パスワードは6文字以上で入力してください。' }),
})

type FormValues = z.infer<typeof schema>

const Login = () => {
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const router = useRouter()
  const { data: session } = useSession()
  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session])

  const onSubmit = async (data: FormValues) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
        // UserCredentialオブジェクトを返すPromiseが返ってくる
        .then((credential) => credential.user.getIdToken(true))
        // NextAuthのsignInメソッド / CredentialsProviderのauthorizeメソッドで利用するtokenを渡している
        .then((token) => signIn('credentials', { token }))
      toast.success('ログインしました。')
    } catch (error: any) {
      switch (error.code) {
        case 'auth/user-not-found':
          setErrorMessage('ユーザーが見つかりませんでした。')
          break
        case 'auth/wrong-password':
          setErrorMessage('パスワードが間違っています。')
          break
        default:
          setErrorMessage('エラーが発生しました。')
      }
      toast.error('ログインに失敗しました。')
      console.error(error)
    }
  }

  return (
    <Container maxW='580px'>
      <Text fontSize='2xl' fontWeight='bold' textAlign='center' my={8}>
        {festivalName} コンテンツ管理システム
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display='flex' flexDirection='column' gap={4}>
          <FormControl isInvalid={!!errors.email} isRequired>
            <FormLabel>メールアドレス</FormLabel>
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
            <FormLabel>パスワード</FormLabel>
            <InputGroup>
              <Input
                type={isPasswordShown ? 'text' : 'password'}
                borderColor='gray.300'
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
        </Box>
        <Box mt={8}>
          {errorMessage && (
            <Alert
              status='error'
              mt={4}
              rounded='md'
              fontSize='sm'
              color='red.500'
            >
              <AlertIcon />
              {errorMessage}
            </Alert>
          )}
          <Button
            type='submit'
            colorScheme='blue'
            variant='solid'
            width='100%'
            mt={4}
            disabled={!isValid || isSubmitting}
            isLoading={isSubmitting}
          >
            ログイン
          </Button>
        </Box>
      </form>
      <Box
        width='100%'
        display='flex'
        flexDirection='column'
        mt={8}
        fontSize='sm'
        color='gray.500'
      >
        {administrator.name && <Text>運営:{administrator.name}</Text>}
        {administrator.email && (
          <Text>
            メールアドレス:
            <Link color='blue.500' href={`mailto:${administrator.email}`}>
              {administrator.email}
            </Link>
          </Text>
        )}
        {administrator.url && (
          <Text>
            URL:
            <Link color='blue.500' href={administrator.url}>
              {administrator.url}
            </Link>
          </Text>
        )}
      </Box>
    </Container>
  )
}

export default Login
