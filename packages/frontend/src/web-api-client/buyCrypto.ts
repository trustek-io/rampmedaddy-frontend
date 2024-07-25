import request from './request'

export interface BuyCryptoArgs {
  source: string
  onramp: string
  destination: string
  amount: number
  type: string
  paymentMethod: string
  network?: string
  wallet: string | null
  supportedParams: {
    partnerData: {
      redirectUrl: {
        success: string | null
        failure: string | null
      }
    }
  }
  metaData: {
    quoteId: string
  }
}

export interface BuyCryptoResponse {
  message: {
    validationInformation: boolean
    status: string
    sessionInformation: {
      source: string
      destination: string
      amount: number
      type: string
      paymentMethod: string
      wallet: string
      onramp: string
      supportedParams: {
        partnerData: {
          redirectUrl: {
            success: string
            failure: string
          }
        }
      }
      metaData: {
        quoteId: string
      }
      country: string
      uuid: string
      expiringTime: number
      sessionId: string
    }
    transactionInformation: {
      url: string
      type: string
      transactionId: string
      params: {
        permissions: string
      }
    }
  }
}

export const buyCryptoApi = async (
  args: BuyCryptoArgs
): Promise<BuyCryptoResponse> =>
  request({
    method: 'POST',
    url: 'https://api.onramper.com/checkout/intent',
    data: args,
  })
