import numeral from 'numeral'

import { BuyQuote, Crypto, Error, Limit } from 'src/web-api-client'
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

const getLimitError = (errors?: Error[]): Error | null => {
  if (
    !errors?.length ||
    errors.every((error) => error.type !== 'LimitMismatch')
  )
    return null

  return errors.find((error) => error.type === 'LimitMismatch') || null
}

export const getPaymentMethodOptions = (
  quotes: BuyQuote[]
): PaymentMethodOption[] => {
  const filteredArray = quotes
    .filter((item) => {
      if (item.errors?.every((error) => error.type !== 'LimitMismatch'))
        return false

      return !!item.availablePaymentMethods?.length
    })
    .map((item) =>
      item.availablePaymentMethods?.map((method) => ({
        name: method.name,
        limits: method.details.limits.aggregatedLimit,
        rate: item.rate,
        quoteId: item.quoteId,
        paymentMethod: method.paymentTypeId,
        icon: method.icon,
        ramp: item.ramp,
        error: getLimitError(item.errors),
      }))
    )
    .flat()

  console.log('filteredArray', filteredArray)

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

  console.log('uniqueMethods', uniqueMethods)

  return uniqueMethods
}

export const getLimit = (quotes: BuyQuote[]): Limit => {
  const limit: Limit = { min: Infinity, max: -Infinity }

  quotes.forEach((quote) => {
    const max = quote.errors?.[0].maxAmount
    const min = quote.errors?.[0].minAmount

    if (min && min < limit.min) limit.min = min
    if (max && max > limit.max) limit.max = max
  })

  return limit
}

export const getRecommendedPaymentMethods = (
  paymentMethodOptions: PaymentMethodOption[]
): PaymentMethodOption[] =>
  paymentMethodOptions.filter((method) => Math.min(method.rate))
