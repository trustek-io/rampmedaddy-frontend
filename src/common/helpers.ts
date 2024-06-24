import { Asset } from 'src/web-api-client'

export const getFilteredAssets = (assets: Asset[], query: string): Asset[] => {
  return assets.filter((asset) =>
    `${asset.currency_name.toLowerCase()}${asset.currency_symbol.toLowerCase()}`.includes(
      query.replaceAll(/\s/g, '').toLowerCase()
    )
  )
}
