import { InputAdornment, Stack, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import BackButton from 'src/views/components/BackButton'
import AppLayout from 'src/views/templates/AppLayout'
import Icon from 'src/views/components/Icon'

const SendMoney: React.FC = () => {
  const [message, setMessage] = useState('')
  const [amount, setAmount] = useState<number | null>(null)

  const navigate = useNavigate()

  return (
    <AppLayout isWallet>
      <BackButton onClick={() => navigate('/')} />

      <Stack alignItems="center" justifyContent="center">
        <Stack>Photo here</Stack>

        <TextField
          placeholder="0.00"
          type="tel"
          sx={{
            width: '358px',
            mt: 3,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'defaultColor',
              },
              '&:hover fieldset': {
                borderColor: 'hoverColor',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'text.secondary',
              },
            },
          }}
          value={amount}
          variant="outlined"
          inputProps={{
            sx: {
              color: 'text.primary',
              backgroundColor: 'background.paper',
              fontSize: '60px',
            },
          }}
          onChange={(event) => {
            const amount = +event.target.value

            setAmount(amount ? +amount.toFixed(2) : null)
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon
                  icon="bx:dollar"
                  sx={{ width: '56px', height: '66px', color: '#707579' }}
                />
              </InputAdornment>
            ),
          }}
        />

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
