import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Assets from './views/pages/Assets'
import AssetProvider from 'src/views/context/AssetContext'
import Asset from 'src/views/pages/Asset'
import Wallet from './views/pages/Wallet'
// import { useWebAuthn } from 'react-hook-webauthn'
import SendMoney from './views/pages/SendMoney'
import { useWebAuthn } from 'react-hook-webauthn'

const tele = window.Telegram.WebApp

const rpOptions = {
  rpId: 'rampmedaddy-staging.trustek.io',
  rpName: 'rampmedaddy',
}

function App() {
  const { getCredential } = useWebAuthn(rpOptions)

  useEffect(() => {
    const challenge = new Uint8Array(32)
    window.crypto.getRandomValues(challenge)
  }, [])

  const onRegister = useCallback(async () => {
    const credential = await getCredential({
      challenge: 'stringFromServer',
      userDisplayName: 'login',
      userId: 'login',
      userName: 'login',
    })
    console.log(credential)
  }, [getCredential])

  // const onAuth = useCallback(async () => {
  //   const assertion = await getAssertion({ challenge: 'stringFromServer' })
  //   console.log(assertion)
  // }, [getAssertion])

  // const [login, setLogin] = useState('Login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userName, setUserName] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    tele.ready()
    tele.expand()
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ds, setds] = useState<any>()

  useEffect(() => {
    onRegister()
  }, [onRegister])

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
