import {
  Avatar,
  Button,
  Card,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import BackButton from 'src/views/components/BackButton'
import AppLayout from 'src/views/templates/AppLayout'
import Icon from 'src/views/components/Icon'
import { useAssetContext } from 'src/views/context/AssetContext'

const SendMoney: React.FC = () => {
  const [message, setMessage] = useState('')
  const [amount, setAmount] = useState<number | null>(null)

  const { contact, setContact, setBalance, balance } = useAssetContext()

  const navigate = useNavigate()

  useEffect(() => {
    if (!contact) navigate('/')
  }, [contact, navigate])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!amount) return
    e.preventDefault()
    navigate('/progress-steps')
    setBalance(balance - amount)
  }

  useEffect(() => {
    return () => {
      setContact(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AppLayout isWallet>
      <BackButton onClick={() => navigate('/')} />

      <Stack alignItems="center" justifyContent="center">
        <Card
          sx={{
            backgroundColor: '#000',
            p: 3,
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar
            sx={{
              width: '15px',
              height: '15px',
              fontSize: '14px',
              padding: 1,
              backgroundColor: contact?.color,
              mb: 1,
            }}
          >
            {contact?.first_name.charAt(0)}
            {contact?.last_name.charAt(0)}
          </Avatar>
          {contact?.first_name} {contact?.last_name}
        </Card>

        <form onSubmit={handleSubmit}>
          <TextField
            placeholder="0.00"
            type="tel"
            sx={{
              width: '358px',
              mt: 3,
              mb: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'defaultColor',
                },
                '&:hover fieldset': {
                  borderColor: 'hoverColor',
                },
                '&.Mui-focused:not(.Mui-error) fieldset': {
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
                fontSize: '50px',
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
            helperText={
              amount && balance < amount
                ? 'Amount should be less that balance'
                : ''
            }
            error={!!(amount && balance < amount)}
          />

          <TextField
            value={message}
            fullWidth
            placeholder="Add message..."
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setMessage(event.target.value)
            }
            sx={{
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
          />

          <Button
            type="submit"
            disabled={!amount || balance < amount}
            sx={{
              mt: 3,
              width: '100%',
              backgroundColor: 'text.secondary',
              color: '#000',
              fontWeight: 700,
              '&:focused': { backgroundColor: 'text.secondary' },
              '&:hover': { backgroundColor: 'text.secondary', opacity: 0.8 },
            }}
          >
            Send
          </Button>
        </form>
      </Stack>
    </AppLayout>
  )
}

export default SendMoney
