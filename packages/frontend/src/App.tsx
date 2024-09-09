import { useEffect, useState } from 'react'
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
  const [user, setUser] = useState('')

  // const rpOptions = {
  //   rpId: 'webauthn.fancy-app.site',
  //   rpName: 'my super app',
  // }

  async function requestBiometricAuth() {
    try {
      const publicKey: PublicKeyCredentialRequestOptions = {
        challenge: new Uint8Array([
          /* Random bytes as challenge */
        ]), // This needs to be a random array
        allowCredentials: [
          {
            type: 'public-key', // Use string literal for 'public-key'
            id: Uint8Array.from(atob('Your credential ID'), (c) =>
              c.charCodeAt(0)
            ), // Ensure id is Uint8Array
          },
        ],
        timeout: 60000, // Optional: timeout for user interaction
        userVerification: 'required', // Indicates biometrics or PIN
      }

      const credential = await navigator.credentials.get({ publicKey })
      if (credential) {
        alert('Authentication successful!')
        console.log('Authentication successful!')
        // Proceed with launching the Telegram Web App
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error)
      // Handle failure, e.g., fallback to password or cancel app launch
    }
  }

  useEffect(() => {
    tele.ready()
    tele.expand()

    // if (process.env.NODE_ENV === 'development') return

    requestBiometricAuth()
      .then(() => {
        alert('Launching Telegram Web App...')
        // Initialize your web app logic here
      })
      .catch((err) => {
        alert('Failed to authenticate. Web app not launching.')
      })
  }, [])

  // const { getCredential, getAssertion } = useWebAuthn(rpOptions)

  useEffect(() => {
    if (window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user
      if (user) {
        setUserName(`${user.first_name} ${user.last_name}` || user.username)

        setUser(JSON.stringify(user))
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

  useEffect(() => {
    if (window.PublicKeyCredential) {
      // Check if the browser supports WebAuthn for biometric auth
      alert('WebAuthn supported!')
    } else {
      alert('WebAuthn not supported!')
    }
  }, [])

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
