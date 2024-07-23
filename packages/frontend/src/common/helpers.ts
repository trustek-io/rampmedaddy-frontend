import numeral from 'numeral'

import { Crypto } from 'src/web-api-client'

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
