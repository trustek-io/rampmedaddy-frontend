import numeral from 'numeral'

import { BuyQuote, Crypto, Limit } from 'src/web-api-client'
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
  const ramps = ['topper']
  const filteredArray = quotes
    .filter((item) => !item.errors && ramps.includes(item.ramp))
    .map((item) =>
      item.availablePaymentMethods?.map((method) => ({
        name: method.name,
        limits: method.details.limits.aggregatedLimit,
        rate: item.rate,
        quoteId: item.quoteId,
        paymentMethod: method.paymentTypeId,
        icon: method.icon,
        ramp: item.ramp,
      }))
    )
    .flat()

  const uniqueMethods = filteredArray.reduce<PaymentMethodOption[]>(
    (acc, current) => {
      const existing = acc.find((item) => item.name === current?.name)
      if (!existing || existing.rate > current!.rate) {
        return acc
          .filter((item) => item.name !== current!.name)
          .concat(current!)
      }
      return acc
    },
    []
  )

  return uniqueMethods
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

export const getLimitErrorMessage = (quotes: BuyQuote[]): string => {
  const limitErrorQuote = quotes.filter((quote) =>
    quote.errors?.some((error) => error.type === 'LimitMismatch')
  )

  const { max, min } = getLimit(limitErrorQuote)

  if (min !== Infinity && max !== -Infinity)
    return `Amount should be in between USD ${min} and USD ${max}`

  return ''
}
