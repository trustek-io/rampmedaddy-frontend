import axios from 'axios'
import { CRYPTO_COM_TOKEN } from './request'

export interface CreateCryptoComPaymentArgs {
  amount: number
  currency: string // fiat
  crypto_currency: string
  wallet_address: string
  network: string
  return_url: string
  cancel_url: string
}

export interface CreateCryptoComPaymentResponse {
  payment_url: string
}

export const createCryptoComPaymentApi = async (
  args: CreateCryptoComPaymentArgs
): Promise<CreateCryptoComPaymentResponse> => {
  const response = await axios.post(
    'https://pay.crypto.com/api/payments',
    args,
    { headers: { Authorization: `Bearer ${CRYPTO_COM_TOKEN}` } }
  )

  return response.data
}
