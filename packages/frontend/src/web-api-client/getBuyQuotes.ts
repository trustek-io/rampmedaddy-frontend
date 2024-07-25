import request from './request'

export interface BuyQuotesArgs {
  sourceCurrency: string
  destinationCurrency: string
  amount: string
}

export interface Limit {
  max: number
  min: number
}

export interface AvailablePaymentMethod {
  paymentTypeId: string
  name: string
  icon: string
  details: {
    currencyStatus: string
    limits: {
      aggregatedLimit: Limit
      banxa: Limit
    }
  }
}

export interface BuyQuote {
  rate: number
  networkFee?: number
  transactionFee?: number
  payout?: number
  availablePaymentMethods?: AvailablePaymentMethod[]
  ramp: string
  paymentMethod: string
  quoteId: string
  recommendations?: string[]
  errors?: [
    {
      type: string
      errorId: number
      message: string
    },
  ]
}

export const getBuyQuotesApi = async ({
  sourceCurrency,
  destinationCurrency,
  amount,
}: BuyQuotesArgs): Promise<BuyQuote[]> =>
  request({
    method: 'GET',
    // url: `${BASE_URL}/crypto_purchases/${sourceCurrency}/${destinationCurrency}`,
    url: `https://api.onramper.com/quotes/${sourceCurrency}/${destinationCurrency}`,
    params: { amount },
  })
