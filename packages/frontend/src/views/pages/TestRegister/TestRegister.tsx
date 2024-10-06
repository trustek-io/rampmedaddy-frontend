import { Button, Stack } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'src/hooks/routerHooks'
// import { useNavigate } from 'react-router-dom'

const generateRandomBuffer = (length: number): Uint8Array => {
  const randomBuffer = new Uint8Array(length)
  window.crypto.getRandomValues(randomBuffer)
  return randomBuffer
}

const TestRegister: React.FC = () => {
  const [keyId, setKeyId] = useState('')

  const searchParams = useSearchParams()

  // const navigate = useNavigate()

  const storeCredential = (
    credential: PublicKeyCredential,
    challenge: Uint8Array
  ) => {
    const credentialData = {
      rawId: Array.from(new Uint8Array(credential.rawId)),
      challenge: Array.from(challenge),
    }

    localStorage.setItem('webauthn_credential', JSON.stringify(credentialData))
  }

  const getStoredCredential = (): any => {
    const storedCredential = localStorage.getItem('webauthn_credential')

    return storedCredential ? JSON.parse(storedCredential) : null
  }

  // useEffect(() => {
  //   if (keyId) {
  //     setTimeout(() => {
  //       window.location.href = 'tg://resolve?domain=@RansdomTestBot'
  //     }, 1000)
  //   }
  // }, [keyId, navigate])

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

  const registerPasskey = useCallback(async () => {
    if (!window.PublicKeyCredential) {
      console.log('WebAuthn API is not supported')
      return
    }

    try {
      const challenge = generateRandomBuffer(32)

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions =
        {
          challenge: Uint8Array.from(`${challenge}`, (c) => c.charCodeAt(0)),
          rp: {
            name: 'rampmedaddy',
            // id: 'c830-82-193-116-75.ngrok-free.app/',
          },
          user: {
            id: Uint8Array.from(
              user ? `${user.id}` : `${generateRandomBuffer(16)}`,
              (c) => c.charCodeAt(0)
            ),
            name: `${searchParams.firstName} ${searchParams.lastName}`,
            displayName: `${searchParams.firstName} ${searchParams.lastName}`,
          },
          pubKeyCredParams: [
            {
              type: 'public-key',
              alg: -7,
            },
            // { type: 'public-key', alg: -257 },
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
          },
          timeout: 60000,
          attestation: 'direct',
        }

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      })

      storeCredential(credential as PublicKeyCredential, challenge)

      console.log(`'Passkey created' ${credential?.id}`)
    } catch (error) {
      console.log('error', error)
    }
  }, [user])

  const authenticateWithFaceID = React.useCallback(async () => {
    const storedCred = getStoredCredential()

    if (!storedCred) return

    console.log('keyId', keyId)

    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions =
      {
        challenge: new Uint8Array(storedCred.challenge),
        allowCredentials: [
          {
            id: new Uint8Array(storedCred.rawId),
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
  }, [keyId])

  return (
    <Stack>
      {/* <Typography sx={{ color: '#fff' }}> {user?.first_name}</Typography> */}

      <Button onClick={registerPasskey}>Register</Button>
      {keyId && <Button onClick={authenticateWithFaceID}>Sign in</Button>}
    </Stack>
  )
}

export default TestRegister
