import { Button, Stack, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'

const TestRegister: React.FC = () => {
  const [keyId, setKeyId] = useState('')

  console.log(keyId)

  useEffect(() => {
    const localKeyId = localStorage.getItem('keyId')

    if (localKeyId) setKeyId(localKeyId)
  }, [])

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

  function generateClientChallenge() {
    const challenge = new Uint8Array(32)
    window.crypto.getRandomValues(challenge)

    return challenge
  }

  const registerPasskey = useCallback(async () => {
    // if (!user) return

    if (!window.PublicKeyCredential) {
      alert('WebAuthn API is not supported')
      // Provide an alternative authentication method or notify the user
      return
    }

    try {
      const challenge = generateClientChallenge()

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions =
        {
          challenge: Uint8Array.from(`${challenge}`, (c) => c.charCodeAt(0)),
          rp: {
            name: 'JHJJK',
          },
          user: {
            id: Uint8Array.from(user ? `${user.id}` : 'kjlbhnvg12kjmnb', (c) =>
              c.charCodeAt(0)
            ),
            name: user?.first_name ?? 'Test first_name',
            displayName: user?.first_name ?? 'Test first_name',
          },
          pubKeyCredParams: [
            {
              type: 'public-key',
              alg: -7,
            },
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

      alert(`'Passkey created' ${credential?.id}`)

      // if (!localStorage.hasOwnProperty('keyId') && credential?.id) {
      // localStorage.setItem('keyId', credential.id)
      setKeyId(credential?.id ?? '')
      // }
    } catch (error) {
      alert(JSON.stringify(error))
    }
  }, [user])

  async function authenticateWithFaceID() {
    const challenge = generateClientChallenge()

    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions =
      {
        challenge: challenge,
        allowCredentials: [
          {
            id: Uint8Array.from(`${keyId}`, (c) => c.charCodeAt(0)),
            type: 'public-key',
          },
        ],
        userVerification: 'required',
        timeout: 60000,
      }

    try {
      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      })
      console.log('Authentication successful:', assertion)
    } catch (err) {
      console.error('Error during authentication:', err)
    }
  }

  return (
    <Stack>
      <Typography sx={{ color: '#fff' }}> {user?.first_name}</Typography>

      <Button onClick={registerPasskey}>Register</Button>
      {keyId && <Button onClick={authenticateWithFaceID}>Sign in</Button>}
    </Stack>
  )
}

export default TestRegister
