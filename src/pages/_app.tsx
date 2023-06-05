import '@/styles/globals.css'
import { ToastContainer } from 'react-toastify'

import type { AppPropsWithLayout } from 'next/app'
import type { Session } from 'next-auth'

import { ChakraProvider as ChakraBaseProvider } from '@chakra-ui/provider'

import { SessionProvider } from 'next-auth/react'

import theme from '@/libs/theme'
import 'react-toastify/dist/ReactToastify.css'

export default function App({
  Component,
  pageProps,
}: AppPropsWithLayout<{ session: Session }>) {
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <ChakraBaseProvider theme={theme}>
      <SessionProvider session={pageProps.session}>
        <ToastContainer />
        {getLayout(<Component {...pageProps} />)}
      </SessionProvider>
    </ChakraBaseProvider>
  )
}
