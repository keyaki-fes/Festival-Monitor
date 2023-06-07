import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

import { NextPageWithLayout } from 'next'
import { useRouter } from 'next/router'

import {
  Container,
  Box,
  Text,
  Icon,
  Alert,
  AlertIcon,
  Button,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react'

import axios from 'axios'
import Avatar from 'boring-avatars'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useSession } from 'next-auth/react'
import { MdManageAccounts } from 'react-icons/md'

import Loading from '@/components/Loading'
import { Layout } from '@/layouts/Layout'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('ja')
dayjs.tz.setDefault('Asia/Tokyo')

const UserDetail = ({ title, value }: any) => {
  return (
    <Box display='flex' flexDirection='row' alignItems='center' gap={4}>
      <Box w={32} bg='blue.100' rounded='md' py={0.5}>
        <Text
          fontSize='0.85rem'
          color='blue.600'
          textAlign='center'
          fontWeight='bold'
        >
          {title}
        </Text>
      </Box>
      <Text fontSize='0.95rem' color='gray.700' fontWeight='bold'>
        {value}
      </Text>
    </Box>
  )
}

const AccountId: NextPageWithLayout = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [accountInfo, setAccountInfo] = useState<any>(null)
  const [isAdminChecked, setIsAdminChecked] = useState<'true' | 'false'>(
    'false'
  )
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session || !router.isReady) return
    if (session?.user?.uid === router.query.id) {
      toast.error('自分自身のアカウントは編集できません。')
      return
    }
  }, [session, router.query.id])

  useEffect(() => {
    if (!router.isReady) return
    axios
      .get(`/api/admin/accounts/${router.query.id}`)
      .then((res) => {
        setAccountInfo(res.data)
        setIsLoading(false)
        setIsAdminChecked(
          res.data.user?.customClaims?.isAdmin ? 'true' : 'false'
        )
      })
      .catch((err) => {
        console.log(err)
        setIsLoading(false)
        if (err.response.status === 404) {
          toast.error('アカウントが見つかりませんでした。')
          return
        }
        toast.error('エラーが発生しました。')
      })
  }, [router.isReady])

  const handleUpdateAdmin = () => {
    if (!accountInfo) return
    axios
      .post(`/api/admin/accounts/${accountInfo.user.uid}`, {
        isAdmin: isAdminChecked === 'true',
      })
      .then(() => {
        toast.success('管理者権限を更新しました。')
      })
      .catch((err) => {
        console.log(err)
        toast.error('エラーが発生しました。')
      })
  }

  const handleDeleteAccount = () => {
    if (!accountInfo) return
    axios
      .delete(`/api/admin/accounts/${accountInfo.user.uid}`)
      .then(() => {
        toast.success('アカウントを削除しました。')
        router.push('/admin/accounts')
      })
      .catch((err) => {
        console.log(err)
        toast.error('エラーが発生しました。')
      })
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <Container maxW='container.xl'>
      <Box display='flex' flexDirection='row' alignItems='center' mb={4}>
        <Icon as={MdManageAccounts} boxSize={8} mr={2} />
        <Box>
          <Text fontSize='2xl' fontWeight='bold'>
            個別アカウント管理
          </Text>
          <Text fontSize='sm' color='gray.600'>
            アカウントの管理を行います。
          </Text>
        </Box>
      </Box>
      <Box mt={4} display='flex' flexDirection='column'>
        <Box display='flex' flexDirection='row' alignItems='center' gap={4}>
          <Icon
            as={Avatar}
            name={accountInfo?.user?.email}
            boxSize={8}
            variant='beam'
            mr={2}
          />
          <Text fontSize='2xl' fontWeight='bold'>
            {accountInfo?.user?.email}
          </Text>
        </Box>
        <Box h='1px' bg='gray.200' my={4} />
        <Box display='flex' flexDirection='column' gap={3}>
          <UserDetail
            title='ユーザーID'
            value={accountInfo?.user?.uid as string}
          />
          <UserDetail
            title='ロール'
            value={accountInfo?.user?.isAdmin ? '管理者' : '一般ユーザー'}
          />
          <UserDetail
            title='作成日時'
            value={dayjs(accountInfo?.user?.metadata?.creationTime).format(
              'YYYY/MM/DD HH:mm:ss'
            )}
          />
          <UserDetail
            title='最終ログイン日時'
            value={dayjs(accountInfo?.user?.metadata?.lastSignInTime).format(
              'YYYY/MM/DD HH:mm:ss'
            )}
          />
        </Box>
      </Box>
      <Box
        w='100%'
        px={4}
        py={4}
        border='1px'
        borderColor='gray.200'
        rounded='md'
        mt={4}
      >
        <Text fontSize='xl' fontWeight='bold' mb={4}>
          管理者権限
        </Text>
        <Box display='flex' flexDirection='column' gap={3}>
          <RadioGroup
            onChange={setIsAdminChecked as any}
            value={isAdminChecked}
          >
            <Stack direction='column'>
              <Radio value='true'>管理者</Radio>
              <Radio value='false'>一般ユーザー</Radio>
            </Stack>
          </RadioGroup>
          <Button colorScheme='blue' size='sm' onClick={handleUpdateAdmin}>
            更新
          </Button>
          <Alert
            status='warning'
            rounded='md'
            color='yellow.800'
            fontSize='0.95rem'
          >
            <AlertIcon />
            管理者権限を付与すると、アカウントの削除や他のアカウントの管理ができるようになります。
          </Alert>
        </Box>
      </Box>
      <Box
        w='100%'
        px={4}
        py={4}
        border='1px'
        borderColor='red.200'
        rounded='md'
        mt={4}
      >
        <Text fontSize='xl' fontWeight='bold' mb={4}>
          アカウントの削除
        </Text>
        <Box display='flex' flexDirection='column' gap={3}>
          <Button colorScheme='red' size='sm' onClick={handleDeleteAccount}>
            削除
          </Button>
          <Alert
            status='warning'
            rounded='md'
            color='yellow.800'
            fontSize='0.95rem'
          >
            <AlertIcon />
            アカウントを削除すると、アカウントに紐づくデータも削除されます。
          </Alert>
        </Box>
      </Box>
    </Container>
  )
}

AccountId.getLayout = (page) => <Layout>{page}</Layout>

export default AccountId
