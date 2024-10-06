// import { Button, Stack } from '@mui/material'
// import React, { useState } from 'react'
// import { buildConnectTokenAndUrl } from 'src/common/passkey'
// import { useCurrentAddress } from 'src/hooks/useAccounts'

// const TestInitPage: React.FC = () => {
//   const [connectToken, setConnectToken] = useState('')
//   const [connectLoading, setConnectLoading] = useState(false)

//   const address = useCurrentAddress()

//   console.log('address', address)

//   const onConnect = () => {
//     try {
//       const { token, url } = buildConnectTokenAndUrl('lkjhgfdsDTRYUIOUyghfhjk')
//       setConnectToken(token)
//       setConnectLoading(true)
//       console.log('url', url)
//       console.log('token', token)
//       window.Telegram.WebApp.openLink(url)
//     } catch (error) {
//       console.log('>>>>error ', error)
//     }
//   }

//   return (
//     <Stack>
//       <Button onClick={onConnect}>Test</Button>
//     </Stack>
//   )
// }

// export default TestInitPage

import { Button, Typography } from '@mui/material'

const tele = window.Telegram.WebApp

export default function App() {
  const openUrl = (url: string) => {
    tele.openLink(url)
  }

  const onConnect = () => {
    const serachParams = new URLSearchParams({
      id: tele?.initDataUnsafe?.user?.id,
      firstName: tele?.initDataUnsafe?.user?.first_name,
      lastName: tele?.initDataUnsafe?.user?.last_name,
    })
    try {
      const url = `https://rampmedaddy-staging.trustek.io/auth?${serachParams}`
      // const { url } = buildConnectTokenAndUrl(
      //   'lkJMNCFTYUiolkjhgvbnjkljhgftyuio',
      //   tele?.initDataUnsafe?.user?.first_name
      // )
      openUrl(url)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div id="app">
      <div>Test</div>
      <Typography sx={{ color: '#fff' }}>
        {tele?.initDataUnsafe?.user?.first_name}
      </Typography>

      <Button onClick={onConnect}>Connect</Button>

      {/* {address ? (
        <div className="mb-[30px]">
          <h1 className="text-xl mb-4">Connected: </h1>
          <div>{address}</div>
          <div className="my-[30px]">
            <h2 className="text-xl">Sign message: </h2>
            <input
              type="text"
              placeholder={message ? message : 'Type message'}
              className="input input-bordered input-accent w-full max-w-xs mt-[4px]"
              onChange={(e) => setMessage(e.currentTarget.value)}
            />
            <div>
              <button
                className="btn btn-primary mt-[10px] w-[120px] capitalize"
                disabled={!message || signLoading}
                onClick={onSignMessage}
              >
                {signLoading ? (
                  <span className="loading loading-spinner loading-md" />
                ) : (
                  'Sign'
                )}
              </button>
            </div>
            <div className="divider" />
          </div>

          <div className="my-[30px]">
            <h2 className="text-xl">Sign and Send transaction: </h2>
            <input
              type="text"
              placeholder={toAddress ? toAddress : 'To address'}
              className="input input-bordered input-accent w-full max-w-xs mt-[8px] text-xs"
              onChange={(e) => setToAddress(e.currentTarget.value)}
            />
            <input
              type="number"
              placeholder={amount > 0 ? amount.toString() : 'Amount'}
              className="input input-bordered input-accent w-full max-w-xs mt-[8px]"
              onChange={(e) => setAmount(Number(e.currentTarget.value))}
            />
            <div className="mt-[10px]">
              <button
                className="btn btn-primary w-[120px] capitalize block"
                disabled={amount <= 0 || !toAddress || signTxLoading}
                onClick={onSignTx}
              >
                {signTxLoading ? (
                  <span className="loading loading-spinner loading-md" />
                ) : (
                  'Sign'
                )}
              </button>
              <button
                className="btn btn-primary w-[120px] capitalize mt-[12px] block"
                disabled={amount <= 0 || !toAddress || sendLoading}
                onClick={onSendTx}
              >
                {sendLoading ? (
                  <span className="loading loading-spinner loading-md" />
                ) : (
                  'Send'
                )}
              </button>
            </div>
            <div className="divider" />
          </div>

          <button
            className="btn btn-primary capitalize w-[120px]"
            onClick={() => updateAddress(null)}
          >
            Disconnect
          </button>
          <div className="divider" />
        </div>
      ) : (
        <div className="text-center">
          <button
            className="btn btn-primary capitalize w-[200px] mt-[30px]"
            disabled={connectLoading}
            onClick={onConnect}
          >
            {connectLoading ? (
              <span className="loading loading-spinner loading-md" />
            ) : (
              'JoyID Passkey connect'
            )}
          </button>
        </div>
      )} */}
    </div>
  )
}
