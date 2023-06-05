import '@/styles/globals.css'
import { ToastContainer } from 'react-toastify'

import type { AppProps } from 'next/app'

import { ChakraProvider as ChakraBaseProvider } from '@chakra-ui/provider'

import { SessionProvider } from 'next-auth/react'

import theme from '@/libs/theme'
import 'react-toastify/dist/ReactToastify.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraBaseProvider theme={theme}>
      <SessionProvider session={pageProps.session}>
        <ToastContainer theme='colored' />
        <Component {...pageProps} />
      </SessionProvider>
    </ChakraBaseProvider>
  )
}
