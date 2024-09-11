import { Button, Stack } from '@mui/material'
import React, { useEffect } from 'react'
import { account, native, server } from 'src/lib/common'
import base64url from 'base64url'
// import { Buffer } from 'buffer'

const TestRegister: React.FC = () => {
  let keyId: string
  let contractId: string
  let admins: number
  let adminKeyId: string | undefined
  let balance: string
  let signers: {
    id: string
    pk: string
    admin: boolean
    expired?: boolean | undefined
  }[] = []

  // let keyName: string = ''
  // let keyAdmin: boolean = false

  async function getWalletSigners() {
    signers = await server.getSigners(contractId)
    console.log(signers)

    const adminKeys = signers.filter(({ admin }) => admin)
    adminKeyId = (adminKeys.find(({ id }) => keyId === id) || adminKeys[0]).id
    admins = adminKeys.length
  }

  const register = async () => {
    const user = prompt('Give this passkey a name')

    if (!user) return

    try {
      const {
        keyId: kid,
        contractId: cid,
        xdr,
      } = await account.createWallet('Super Peach', user)
      const res = await server.send(xdr!)

      console.log(res)

      const keyId = base64url(kid)
      localStorage.setItem('sp:keyId', keyId)

      console.log('register', cid)

      await getWalletSigners()
    } catch (err: any) {
      alert(err.message)
    }
  }

  async function getWalletBalance() {
    const { result } = await native.balance({ id: contractId })

    balance = result.toString()
    console.log(balance)
  }

  async function connect(keyId_?: string) {
    try {
      const { keyId: kid, contractId: cid } = await account.connectWallet({
        keyId: keyId_,
        getContractId: (keyId) => server.getContractId(keyId),
      })

      keyId = base64url(kid)
      localStorage.setItem('sp:keyId', keyId)

      contractId = cid
      console.log('connect', cid)

      await getWalletBalance()
      await getWalletSigners()
    } catch (err: any) {
      alert(err.message)
    }
  }

  useEffect(() => {
    if (localStorage.hasOwnProperty('sp:keyId')) {
      keyId = localStorage.getItem('sp:keyId')!
      connect(keyId)
    }
  }, [])

  return (
    <Stack>
      <Button onClick={register}>Register</Button>
      <Button>Sign in</Button>
    </Stack>
  )
}

export default TestRegister
