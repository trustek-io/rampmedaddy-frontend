import { Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from 'src/views/components/BackButton'
import AppLayout from 'src/views/templates/AppLayout'
import Icon from 'src/views/components/Icon'

const SendMoney: React.FC = () => {
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  return (
    <AppLayout isWallet>
      <BackButton onClick={() => navigate('/')} />

      <Stack alignItems="center" justifyContent="center">
        <Stack>Photo here</Stack>

        <Stack direction="row" alignItems="center" justifyContent="center">
          <Icon
            icon="bx:dollar"
            sx={{ width: '56px', height: '66px', color: '#707579' }}
          />
          <Typography sx={{ fontSize: '60px' }}>100</Typography>
        </Stack>

        <TextField
          value={message}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setMessage(event.target.value)
          }
        ></TextField>
      </Stack>
    </AppLayout>
  )
}

export default SendMoney
