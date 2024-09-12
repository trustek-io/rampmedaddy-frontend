import {
  Avatar,
  Button,
  Card,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import BackButton from 'src/views/components/BackButton'
import AppLayout from 'src/views/templates/AppLayout'
import Icon from 'src/views/components/Icon'
import { useAssetContext } from 'src/views/context/AssetContext'
import { generateClientChallenge } from '../TestRegister/TestRegister'

const SendMoney: React.FC = () => {
  const [message, setMessage] = useState('')
  const [amount, setAmount] = useState<number | null>(null)
  const [keyId, setKeyId] = useState('')

  const { contact, setContact, setBalance, balance } = useAssetContext()

  const navigate = useNavigate()

  const registerPasskey = useCallback(async () => {
    // if (!user) return

    if (!window.PublicKeyCredential) {
      alert('WebAuthn API is not supported')
      return
    }

    try {
      const challenge = generateClientChallenge()

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions =
        {
          challenge: Uint8Array.from(`${challenge}`, (c) => c.charCodeAt(0)),
          rp: {
            name: 'rampmedaddy',
            // id: 'rampmedaddy-staging.trustek.io',
          },
          user: {
            id: Uint8Array.from('kjlbhnvg12kjmnb', (c) => c.charCodeAt(0)),
            name: 'Test Name',
            displayName: 'Test Name',
          },
          pubKeyCredParams: [
            {
              type: 'public-key',
              alg: -7,
            },
            { type: 'public-key', alg: -257 },
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
          },
          timeout: 60000,
          attestation: 'none' as AttestationConveyancePreference,
        }

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      })

      // alert(`'Passkey created' ${credential?.id}`)

      console.log(credential)
      setKeyId(credential?.id ?? '')

      // if (!localStorage.hasOwnProperty('keyId') && credential?.id) {
      //   localStorage.setItem('keyId', credential.id)
      // }
    } catch (error) {
      // alert(JSON.stringify(error))
      console.log(error)
    }
  }, [])

  useEffect(() => {
    if (!contact) navigate('/')
  }, [contact, navigate])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!amount) return
    e.preventDefault()
    registerPasskey()
  }

  useEffect(() => {
    return () => {
      setContact(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (keyId && amount) {
      setTimeout(() => {
        navigate('/progress-steps')
        setBalance(balance - amount)
      }, 1000)
    }
  }, [keyId, navigate, balance, amount, setBalance])

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
              borderRadius: '15px',
              backgroundColor: 'background.paper',
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
                borderRadius: '10px',
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
              borderRadius: '15px',
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
              backgroundColor: 'background.paper',
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
