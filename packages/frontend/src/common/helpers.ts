import numeral from 'numeral'

import { BuyQuote, Crypto } from 'src/web-api-client'
import { PaymentMethodOption } from 'src/views/pages/Asset'

export const SUPPORTED_RAMPS = ['topper']

export const getFilteredAssets = (
  assets: Crypto[],
  query: string
): Crypto[] => {
  return assets.filter((asset) =>
    `${asset.name.toLowerCase()}${asset.symbol.toLowerCase()}`.includes(
      query.replaceAll(/\s/g, '').toLowerCase()
    )
  )
}

export const formatNumber = (number?: number | string): string => {
  if (!number) return ''

  if (number?.toString().includes('.')) {
    const [amount, decimal] = number.toString().split('.')

    return numeral(amount).format('0,0') + '.' + decimal.slice(0, 2)
  }

  return numeral(number).format('0,0')
}

export const getPaymentMethodOptions = (
  quotes: BuyQuote[]
): PaymentMethodOption[] => {
  return quotes
    .filter((item) => !item.errors && SUPPORTED_RAMPS.includes(item.ramp))
    .flatMap((item) =>
      item.availablePaymentMethods?.map((method) => ({
        name: method.name,
        rate: item.rate,
        quoteId: item.quoteId,
        paymentMethod: method.paymentTypeId,
        icon: method.icon,
        ramp: item.ramp,
      }))
    )
    .filter((method): method is PaymentMethodOption => method !== undefined)
}

export const getSupportedQuote = (quotes: BuyQuote[]): BuyQuote | undefined =>
  quotes.find((quote) => SUPPORTED_RAMPS.includes(quote.ramp))

export const getLimitErrorMessage = (quotes: BuyQuote[]): string => {
  const supportedQuote = getSupportedQuote(quotes)

  const error = supportedQuote?.errors?.find(
    (error) => error.type === 'LimitMismatch'
  )

  if (!error) return ''

  return error.message
}

export const getBestRate = (quotes: BuyQuote[]): number | undefined =>
  getSupportedQuote(quotes)?.rate
