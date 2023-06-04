// https://zenn.dev/yuku/articles/4eb8454079e680

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
} from '@chakra-ui/theme/components'

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
})

export default theme
