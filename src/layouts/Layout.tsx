import { ReactElement } from 'react'
import type { IconType } from 'react-icons'

import { useRouter } from 'next/router'

import { Link } from '@chakra-ui/next-js'
import { Box, Text, Icon } from '@chakra-ui/react'

import {
  MdManageAccounts,
  MdPersonAddAlt1,
  MdAddChart,
  MdInsertChartOutlined,
} from 'react-icons/md'

import { festivalName } from '@/libs/constants'

type LayoutProps = {
  readonly children: ReactElement
}

const LinkButton = ({
  path,
  href,
  icon,
  title,
}: {
  path: string
  href: string
  icon: IconType
  title: string
}) => {
  return (
    <Link
      href={href}
      justifyContent='flex-start'
      display={'flex'}
      alignItems={'center'}
      flexDirection={'row'}
      gap={2}
      px={2}
      py='0.3rem'
      rounded={'md'}
      color='gray.700'
      _hover={{
        backgroundColor: 'gray.100',
      }}
      {...(path === href && {
        color: 'white',
        backgroundColor: 'blue.500',
        _hover: {
          backgroundColor: 'blue.600',
        },
      })}
    >
      <Icon as={icon} boxSize={4} />
      <Text fontSize={'0.9rem'} fontWeight={'bold'}>
        {title}
      </Text>
    </Link>
  )
}

export const Layout = ({ children }: LayoutProps) => {
  const router = useRouter()
  const path = router.pathname
  return (
    <Box display={'flex'} flexDirection={'column'} w={'100vw'} minH={'100vh'}>
      <Box
        w={'100%'}
        h={'55px'}
        borderBottom={'1px solid'}
        borderColor={'gray.200'}
        display={'flex'}
        px={4}
        alignItems={'center'}
        backgroundColor={'white'}
      >
        <Text fontSize={'lg'} fontWeight={'bold'} color='gray.700' ml={2}>
          {festivalName} コンテンツ管理システム
        </Text>
      </Box>
      <Box w={'100%'} display={'flex'} flexDirection={'row'} flex={1}>
        <Box
          w={'260px'}
          minH={'100%'}
          borderRight={'1px solid'}
          borderColor={'gray.200'}
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          boxShadow={'6px 0px 10px -8px rgba(0, 0, 0, 0.4)'}
          backgroundColor={'white'}
          color={'gray.700'}
        >
          <Box
            w={'100%'}
            display={'flex'}
            flexDirection={'column'}
            gap={0.5}
            mt={4}
            px={2}
          >
            <Text fontSize={'0.9rem'} fontWeight={'bold'} ml={2} my={1}>
              アカウント
            </Text>
            <LinkButton
              path={path}
              href={'/admin/accounts'}
              icon={MdManageAccounts}
              title={'アカウント管理'}
            />
            <LinkButton
              path={path}
              href={'/admin/accounts/create'}
              icon={MdPersonAddAlt1}
              title={'アカウント作成'}
            />
            <Text fontSize={'0.9rem'} fontWeight={'bold'} ml={2} my={1}>
              イベント
            </Text>
            <LinkButton
              path={path}
              href={'/admin/events'}
              icon={MdInsertChartOutlined}
              title={'イベント管理'}
            />
            <LinkButton
              path={path}
              href={'/admin/events/create'}
              icon={MdAddChart}
              title={'イベント作成'}
            />
          </Box>
        </Box>
        <Box flex={1} bg='#f9fbfb' overflowY='scroll' py={4} px={2}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
