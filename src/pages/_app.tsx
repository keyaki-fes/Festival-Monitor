import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { ChakraProvider as ChakraBaseProvider } from '@chakra-ui/provider'

import theme from '@/libs/theme'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraBaseProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraBaseProvider>
  )
}
