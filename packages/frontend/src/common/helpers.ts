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
  const filteredArray = quotes
    .filter((item) => !item.errors)
    .map((item) =>
      item.availablePaymentMethods?.map((method) => ({
        name: method.name,
        limits: method.details.limits.aggregatedLimit,
        rate: item.rate,
        quoteId: item.quoteId,
        paymentMethod: item.paymentMethod,
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

export const getLimit = (paymentMethodOptions: PaymentMethodOption[]): Limit => {
  const limit: Limit = { min: Infinity, max: -Infinity }

  paymentMethodOptions.forEach(method => {
    const { min, max } = method.limits;

    if (min < limit.min) limit.min = min;
    if (max > limit.max) limit.max = max;

  })

  return limit
}

export const getRecommendedPaymentMethods = (paymentMethodOptions: PaymentMethodOption[]): PaymentMethodOption[] =>
  paymentMethodOptions.filter((method) =>
    Math.min(method.rate)
  )
