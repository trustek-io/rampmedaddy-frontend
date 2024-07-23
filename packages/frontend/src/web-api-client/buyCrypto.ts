import request, { BASE_URL } from './request'

export interface BuyCryptoArgs {
  onramp: string
  source: string
  destination: string
  amount: number
  type: string
  paymentMethod: string
  network: string
  uuid: string
  originatingHost: string
  partnerContext: string
  wallet: { address: string }
  supportedParams: {
    partnerData: { redirectUrl: { success: string } }
  }
}

export interface BuyCryptoResponse {
  message: {
    validationInformation: boolean
    status: string
    sessionInformation: {
      onramp: string
      source: string
      destination: string
      amount: number
      type: string
      paymentMethod: string
      network: string
      uuid: string
      originatingHost: string
      wallet: {
        address: string
      }
      supportedParams: {
        partnerData: {
          redirectUrl: {
            success: string
          }
        }
      }
      country: string
      expiringTime: number
      sessionId: string
    }
  }
}

export const buyCryptoApi = async (
  args: BuyCryptoArgs
): Promise<BuyCryptoResponse> =>
  request({
    method: 'POST',
    url: `${BASE_URL}/crypto_purchases`,
    // https://api.onramper.com/checkout/intent
    data: args,
  })
