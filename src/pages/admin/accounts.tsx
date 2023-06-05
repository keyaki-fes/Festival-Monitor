import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

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
} from '@chakra-ui/react'

import axios from 'axios'
import type { ListUsersResult } from 'firebase-admin/auth'
import { useSession } from 'next-auth/react'
import {
  MdContentCopy,
  MdManageAccounts,
  MdPersonAddAlt1,
  MdDownload,
} from 'react-icons/md'
import { RiPencilFill } from 'react-icons/ri'

const Accounts = () => {
  // todo:CustomClaimの型を定義する
  // todo:react-tableなどでソートやフィルターを実装する
  // todo:自分自身のアカウントは編集できないようにする
  // todo:ドキュメントを書く
  // todo:アカウント一括作成機能を実装する
  const { data: session } = useSession()
  const router = useRouter()
  const [accountList, setAccountLisr] = useState<ListUsersResult | null>(null)

  useEffect(() => {
    axios
      .get('/api/admin/accounts')
      .then((res) => {
        setAccountLisr(res.data as ListUsersResult)
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
      <Box display='flex' justifyContent='flex-end' mb={4} gap={2}>
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
          onClick={() => router.push('/admin/accounts')}
        >
          アカウント作成
        </Button>
      </Box>

      <TableContainer>
        <Table size='sm'>
          <Thead>
            <Tr>
              <Th>メールアドレス</Th>
              <Th>UID</Th>
              <Th>管理者権限</Th>
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

export default Accounts
