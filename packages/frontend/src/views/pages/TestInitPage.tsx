import { Button, Stack } from '@mui/material'
import React from 'react'

const TestInitPage: React.FC = () => {
  const test = () => {
    window.Telegram.WebApp.openLink('http://localhost:3000/auth')
  }

  return (
    <Stack>
      <Button onClick={test}>Test</Button>
    </Stack>
  )
}

export default TestInitPage
