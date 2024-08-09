import numeral from 'numeral'
import { uniq } from 'lodash'

import { BuyQuote, Crypto, Default, Limit } from 'src/web-api-client'
import { PaymentMethodOption } from 'src/views/pages/Asset'

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
  const filteredArray = quotes
    .filter((item) => !item.errors)
    .map((item) => ({
      rate: item.rate,
      quoteId: item.quoteId,
      paymentMethods:
        item.availablePaymentMethods?.map((method) => method.name).join(', ') ??
        'No available methods',
      ramp: item.ramp,
      payout: item.payout,
      paymentMethod: item.paymentMethod,
    }))

  return filteredArray
}

const getLimit = (quotes: BuyQuote[]): Limit => {
  const limit: Limit = { min: Infinity, max: -Infinity }

  quotes.forEach((quote) => {
    const max = quote.errors?.[0].maxAmount
    const min = quote.errors?.[0].minAmount

    if (min && min < limit.min) limit.min = Number(min.toFixed(2))
    if (max && max > limit.max) limit.max = Number(max.toFixed(2))
  })

  return limit
}

export const getLimitErrorMessage = (
  quotes: BuyQuote[],
  currency: string
): string => {
  const limitErrorQuote = quotes.filter((quote) =>
    quote.errors?.some((error) => error.type === 'LimitMismatch')
  )

  const { max, min } = getLimit(limitErrorQuote)

  if (min !== Infinity && max !== -Infinity)
    return `Amount should be in between ${currency} ${min} and ${currency} ${max}`

  return ''
}

export const getCryptoComLimitErrorMessage = ({
  amount,
  max,
  min,
}: {
  amount: number | null
  max?: number
  min?: number
}): string => {
  if (!amount || !max || !min) return ''

  if (amount > max || amount < min)
    return `Amount should be in between USD ${min} and USD ${max}`

  return ''
}

export const getRate = (quotes: BuyQuote[]): number | undefined =>
  quotes.find((quote) => quote.recommendations?.includes('BestPrice'))?.rate ||
  quotes.find((quote) => quote.recommendations?.includes('LowKyc'))?.rate

export const getSupportedRampsQuotes = (
  quotes: BuyQuote[],
  supportedRamps: string[]
): BuyQuote[] => {
  const supportedRampsQuotes: BuyQuote[] = []

  quotes.forEach((quote) => {
    if (supportedRamps.includes(quote.ramp)) supportedRampsQuotes.push(quote)
  })

  return supportedRampsQuotes
}

export const getCurrencies = (defaults: Record<string, Default>): string[] => {
  const sources = Object.values(defaults).map((value) => value.source)

  return uniq(sources)
}

export const isCryptoComProvider = (
  paymentMethod: PaymentMethodOption | null
): boolean => paymentMethod?.ramp === 'crypto.com'
