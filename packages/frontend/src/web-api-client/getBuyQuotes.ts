import request from './request'
import { v4 as uuidv4 } from 'uuid'

export interface Error {
  errorId: number
  maxAmount?: number
  message: string
  minAmount?: number
  type: string
}

export interface BuyQuotesArgs {
  sourceCurrency: string
  destinationCurrency: string
  amount: string
  paymentMethod?: string
  network: string
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
  errors?: Error[]
}

export const getBuyQuotesApi = async ({
  sourceCurrency,
  destinationCurrency,
  amount,
  paymentMethod,
  network,
}: BuyQuotesArgs): Promise<BuyQuote[]> =>
  request({
    method: 'GET',
    url: `https://api.onramper.com/quotes/${sourceCurrency}/${destinationCurrency}_${network}`,
    params: {
      amount,
      paymentMethod,
      network,
      isRecurringPayment: false,
      type: 'buy',
      input: 'source',
      uuid: uuidv4(),
    },
  })
