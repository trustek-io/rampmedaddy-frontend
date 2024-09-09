import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Assets from './views/pages/Assets'
import AssetProvider from 'src/views/context/AssetContext'
import Asset from 'src/views/pages/Asset'
import Wallet from './views/pages/Wallet'
// import { useWebAuthn } from 'react-hook-webauthn'
import SendMoney from './views/pages/SendMoney'

const tele = window.Telegram.WebApp

function App() {
  // const [login, setLogin] = useState('Login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userName, setUserName] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    tele.ready()
    tele.expand()
  }, [])

  const getCredential = useCallback(async () => {
    const challenge = new Uint8Array(32)
    window.crypto.getRandomValues(challenge) // создаем случайный 32-байтовый challenge

    const publicKeyCredentialCreationOptions = {
      rp: {
        name: 'rampmedaddy',
        id: 'rampmedaddy-staging.trustek.io',
      },
      user: {
        id: Uint8Array.from('userId123', (c) => c.charCodeAt(0)), // пример userId
        name: 'User',
        displayName: 'Full username',
      },
      challenge: challenge, // challenge передается в виде Uint8Array
      pubKeyCredParams: [
        {
          type: 'public-key' as PublicKeyCredentialType,
          alg: -7, // ECDSA с кривой P-256
        },
        {
          type: 'public-key' as PublicKeyCredentialType,
          alg: -257, // RSA с ограничением SHA-256
        },
      ],
      timeout: 60000,
      excludeCredentials: [],
      authenticatorSelection: {
        residentKey: 'preferred' as ResidentKeyRequirement,
        requireResidentKey: false,
        userVerification: 'required' as UserVerificationRequirement,
      },
      attestation: 'none' as AttestationConveyancePreference,
      extensions: {
        credProps: true,
      },
    }

    // Запрос на создание новых учетных данных
    return await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    })
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ds, setds] = useState<any>()

  useEffect(() => {
    getCredential().then((res) => {
      setds(res)
      alert(`Testststtstst ${res}`)
    })
  }, [getCredential])

  // const { getCredential, getAssertion } = useWebAuthn(rpOptions)

  useEffect(() => {
    if (window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user
      if (user) {
        setUserName(`${user.first_name} ${user.last_name}` || user.username)

        setUser(user)
      }
    }
  }, [])

  // const onRegister = useCallback(async () => {
  //   const credential = await getCredential({
  //     challenge: 'stringFromServer',
  //     userDisplayName: login,
  //     userId: login,
  //     userName: login,
  //   })
  //   console.log(credential)
  // }, [getCredential, login])

  // useEffect(() => {
  //   if (window.PublicKeyCredential) {
  //     // Check if the browser supports WebAuthn for biometric auth
  //     alert('WebAuthn supported!')
  //   } else {
  //     alert('WebAuthn not supported!')
  //   }
  // }, [])

  return (
    <BrowserRouter>
      <AssetProvider>
        <Routes>
          <Route path="/" element={<Wallet />} />
          <Route path="/asset" element={<Asset />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/send-money" element={<SendMoney />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AssetProvider>
    </BrowserRouter>
  )
}

export default App
