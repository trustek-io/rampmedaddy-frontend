import numeral from 'numeral'

import { Asset } from 'src/web-api-client'

export const getFilteredAssets = (assets: Asset[], query: string): Asset[] => {
  return assets.filter((asset) =>
    `${asset.currency_name.toLowerCase()}${asset.currency_symbol.toLowerCase()}`.includes(
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
