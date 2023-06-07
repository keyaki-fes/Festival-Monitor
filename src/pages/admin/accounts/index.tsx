import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

import type { NextPageWithLayout } from 'next'
import { useRouter } from 'next/router'

import {
  Box,
  Button,
  Container,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Switch,
} from '@chakra-ui/react'

import axios from 'axios'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import type { ListUsersResult } from 'firebase-admin/auth'
import { useSession } from 'next-auth/react'
import {
  MdContentCopy,
  MdManageAccounts,
  MdPersonAddAlt1,
  MdDownload,
} from 'react-icons/md'
import { RiPencilFill } from 'react-icons/ri'

import Loading from '@/components/Loading'
import { Layout } from '@/layouts/Layout'

import 'dayjs/locale/ja'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('ja')
dayjs.tz.setDefault('Asia/Tokyo')

const Accounts: NextPageWithLayout = () => {
  // todo:CustomClaimの型を定義する
  // todo:react-tableなどでソートやフィルターを実装する
  // todo:自分自身のアカウントは編集できないようにする
  // todo:ドキュメントを書く
  // todo:アカウント一括作成機能を実装する
  // todo:アカウント削除、権限変更機能を実装する
  // todo:存在しているUIDか
  // todo:すでに紐付けされているか
  // todo:アカウント削除時に紐付け先も削除する
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [accountList, setAccountLisr] = useState<ListUsersResult | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  useEffect(() => {
    axios
      .get('/api/admin/accounts')
      .then((res) => {
        setAccountLisr(res.data as ListUsersResult)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  const handleUidCopy = (uid: string) => {
    navigator.clipboard.writeText(uid)
    toast.success('クリップボードにコピーしました。', {
      autoClose: 2000,
      pauseOnFocusLoss: false,
    })
  }

  const handleCSVExport = () => {
    if (!accountList) return
    const csvHeader = ['UID', 'メールアドレス', '権限'].join(',')
    const csvData = accountList?.users
      .map((user) => {
        return [
          user.uid,
          user.email,
          user.customClaims?.admin ? '管理者' : '一般',
        ]
      })
      .join('\n')
    const bom = new Uint8Array([0xef, 0xbb, 0xbf])
    const blob = new Blob([bom, csvHeader, '\n', csvData], {
      type: 'text/csv',
    })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.download = `アカウント一覧.csv`
    a.href = url
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
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
            アカウント管理
          </Text>
          <Text fontSize='sm' color='gray.600'>
            アカウントの一覧と管理者権限の変更が可能です。
          </Text>
        </Box>
      </Box>
      <Box display='flex' justifyContent='flex-end' mb={3} gap={2}>
        <Button
          colorScheme='gray'
          variant='ghost'
          size='sm'
          rounded='md'
          leftIcon={<MdDownload />}
          onClick={handleCSVExport}
        >
          エクスポート（CSV）
        </Button>
        <Button
          colorScheme='blue'
          size='sm'
          rounded='md'
          leftIcon={<MdPersonAddAlt1 />}
          onClick={() => router.push('/admin/accounts/create')}
        >
          アカウント作成
        </Button>
      </Box>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='flex-end'
        gap={1}
        mb={4}
      >
        <Text fontSize='0.95rem' color='gray.600' fontWeight='bold'>
          詳細を表示
        </Text>
        <Switch
          isChecked={isDetailOpen}
          onChange={(e) => setIsDetailOpen(e.target.checked)}
          size='md'
          colorScheme='blue'
        />
      </Box>

      <TableContainer>
        <Table size='sm'>
          <Thead>
            <Tr>
              <Th>メールアドレス</Th>
              <Th>UID</Th>
              <Th>管理者権限</Th>
              {isDetailOpen && (
                <>
                  <Th>作成日時</Th>
                  <Th>最終ログイン日時</Th>
                  <Th>アカウント状態</Th>
                </>
              )}
              <Th>編集</Th>
            </Tr>
          </Thead>
          <Tbody>
            {accountList?.users.map((user) => (
              <Tr key={user.uid}>
                <Td>{user.email}</Td>
                <Td display='flex' alignItems='center'>
                  <Icon
                    as={MdContentCopy}
                    boxSize={4}
                    mr={2}
                    cursor='pointer'
                    onClick={() => handleUidCopy(user.uid)}
                    transition='all 0.2s'
                    _active={{ transform: 'scale(0.9)' }}
                  />
                  {user.uid}
                </Td>
                <Td>{user.customClaims?.isAdmin ? '管理者' : '一般'}</Td>
                {isDetailOpen && (
                  <>
                    <Td>
                      {dayjs(user.metadata.creationTime).format(
                        'YYYY/MM/DD HH:mm:ss'
                      )}
                    </Td>
                    <Td>
                      {user.metadata.lastSignInTime ? (
                        <>
                          {dayjs(user.metadata.lastSignInTime).format(
                            'YYYY/MM/DD HH:mm:ss'
                          )}
                        </>
                      ) : (
                        '未ログイン'
                      )}
                    </Td>
                    <Td>{user.disabled ? '無効' : '有効'}</Td>
                  </>
                )}
                <Td display='flex' alignItems='center'>
                  {session?.user?.email !== user.email ? (
                    <Icon as={RiPencilFill} boxSize={4} />
                  ) : (
                    <Icon as={RiPencilFill} boxSize={4} color='gray.300' />
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  )
}

Accounts.getLayout = (page) => <Layout>{page}</Layout>

export default Accounts
