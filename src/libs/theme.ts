// https://zenn.dev/yuku/articles/4eb8454079e680

import { Noto_Sans_JP } from 'next/font/google'

import { extendBaseTheme } from '@chakra-ui/react'
import {
  Button as ButtonTheme,
  Container as ContainerTheme,
  Heading as HeadingTheme,
  List as ListTheme,
  Link as LinkTheme,
  Switch as SwitchTheme,
  Alert as AlertTheme,
  Select as SelectTheme,
  Input as InputTheme,
  Table as TableTheme,
  Spinner as SpinnerTheme,
} from '@chakra-ui/theme/components'

const notoSansJP = Noto_Sans_JP({
  weight: ['400', '600', '700'],
  style: 'normal',
  display: 'swap',
  preload: false,
})

// https://github.com/chakra-ui/chakra-ui/discussions/7235
const fonts = {
  heading: notoSansJP.style.fontFamily,
  body: notoSansJP.style.fontFamily,
}

const theme = extendBaseTheme({
  components: {
    Button: ButtonTheme,
    Container: ContainerTheme,
    Heading: HeadingTheme,
    List: ListTheme,
    Link: LinkTheme,
    Switch: SwitchTheme,
    Alert: AlertTheme,
    Select: SelectTheme,
    Input: InputTheme,
    Table: TableTheme,
    Spinner: SpinnerTheme,
  },
  colors: {
    // https://tailwindcss.com/docs/customizing-colors
    blue: {
      '50': '#eff6ff',
      '100': '#dbeafe',
      '200': '#bfdbfe',
      '300': '#93c5fd',
      '400': '#60a5fa',
      '500': '#3b82f6',
      '600': '#2563eb',
      '700': '#1d4ed8',
      '800': '#1e40af',
      '900': '#1e3a8a',
    },
  },
  fonts,
})

export default theme
