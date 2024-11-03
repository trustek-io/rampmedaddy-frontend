'use client'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import { ReactNode } from 'react'

const theme = createTheme({
  palette: {
    background: {
      default: '#000000',
      paper: '#212121',
    },
    text: {
      primary: '#ffffff',
      disabled: '#868A90',
      secondary: '#9DFF1E',
    },
  },
})

interface Props {
  children: ReactNode
}

export default function CustomThemeProvider({ children }: Props) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
