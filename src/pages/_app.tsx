import '@/styles/globals.css'
import { ToastContainer } from 'react-toastify'

import type { AppProps } from 'next/app'

import { ChakraProvider as ChakraBaseProvider } from '@chakra-ui/provider'

import theme from '@/libs/theme'
import 'react-toastify/dist/ReactToastify.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraBaseProvider theme={theme}>
      <ToastContainer />
      <Component {...pageProps} />
    </ChakraBaseProvider>
  )
}
