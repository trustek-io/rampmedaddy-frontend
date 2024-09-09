import {
  ApplicationConfiguration,
  DefaultSigner,
  StellarConfiguration,
  Wallet,
  walletSdk,
} from '@stellar/typescript-wallet-sdk'
import axios, { AxiosInstance } from 'axios'

const wallet = walletSdk.Wallet.TestNet()

const customClient: AxiosInstance = axios.create({
  timeout: 1000,
})
let appConfig = new ApplicationConfiguration(DefaultSigner, customClient)
let wal = new Wallet({
  stellarConfiguration: StellarConfiguration.TestNet(),
  applicationConfiguration: appConfig,
})
