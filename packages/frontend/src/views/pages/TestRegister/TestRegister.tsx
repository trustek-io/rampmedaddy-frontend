import { Button, Stack } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function generateClientChallenge() {
  const challenge = new Uint8Array(32)
  window.crypto.getRandomValues(challenge)

  return challenge
}

const TestRegister: React.FC = () => {
  const [keyId, setKeyId] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    if (keyId) {
      setTimeout(() => {
        window.location.href = 'tg://resolve?domain=@RansdomTestBot'
      }, 1000)
    }
  }, [keyId, navigate])

  // useEffect(() => {
  //   const localKeyId = localStorage.getItem('keyId')

  //   if (localKeyId) setKeyId(localKeyId)
  // }, [])

  const [user, setUser] = useState<{
    id: number
    first_name: string
    last_name: string
  } | null>(null)

  useEffect(() => {
    if (window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user
      if (user) {
        setUser(user)
      }
    }
  }, [])

  console.log('user', user)

  const registerPasskey = useCallback(async () => {
    // if (!user) return

    console.log('>>>', window.PublicKeyCredential)

    if (!window.PublicKeyCredential) {
      console.log('WebAuthn API is not supported')
      return
    }

    try {
      const challenge = generateClientChallenge()

      console.log('challenge', challenge)

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions =
        {
          challenge: Uint8Array.from(`${challenge}`, (c) => c.charCodeAt(0)),
          rp: {
            name: 'rampmedaddy',
            // id: 'c830-82-193-116-75.ngrok-free.app/',
          },
          user: {
            id: Uint8Array.from(user ? `${user.id}` : 'kjlbhnvg12kjmnb', (c) =>
              c.charCodeAt(0)
            ),
            name: user?.first_name ?? 'Test Name',
            displayName: user?.first_name ?? 'Test Name',
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

      console.log(`'Passkey created' ${credential?.id}`)

      console.log(credential)
      setKeyId(credential?.id ?? '')

      // if (!localStorage.hasOwnProperty('keyId') && credential?.id) {
      //   localStorage.setItem('keyId', credential.id)
      // }
    } catch (error) {
      console.log('error', error)
    }
  }, [user])

  // useEffect(() => {
  //   registerPasskey()
  //   // eslint-disable-next-line
  // }, [])

  // const authenticateWithFaceID = React.useCallback(async () => {
  //   const challenge = generateClientChallenge()

  //   const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions =
  //     {
  //       challenge: challenge,
  //       allowCredentials: [
  //         {
  //           id: Uint8Array.from(`${keyId}`, (c) => c.charCodeAt(0)),
  //           type: 'public-key',
  //         },
  //       ],
  //       userVerification: 'required',
  //       timeout: 60000,
  //     }

  //   try {
  //     const assertion = await navigator.credentials.get({
  //       publicKey: publicKeyCredentialRequestOptions,
  //     })
  //     console.log('Authentication successful:', assertion)
  //   } catch (err) {
  //     console.error('Error during authentication:', err)
  //   }
  // }, [keyId])

  return (
    <Stack>
      <Button onClick={registerPasskey}>Launch</Button>

      {/* <Typography sx={{ color: '#fff' }}> {user?.first_name}</Typography>

      <Button onClick={registerPasskey}>Register</Button>
      {keyId && <Button onClick={authenticateWithFaceID}>Sign in</Button>} */}
    </Stack>
  )
}

export default TestRegister
