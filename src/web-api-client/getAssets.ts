import request, { BASE_URL } from './request'

export interface SupportNetwork {
  chain_id: string
  network_fee: null | string
  network_name: string
  chain_type: string
  icon_url: string
  network_display_name: string
  processing_time: string
}

export interface Asset {
  currency_symbol: string
  currency_name: string
  price?: number | null
  min_amount: number
  support_networks: SupportNetwork[]
  decimals: number
  max_amount: number
  max_amount_collection: {
    [key: string]: number
    USD: number
  }
  min_amount_collection: {
    [key: string]: number
    USD: number
  }
}

export const getAssetsApi = async (): Promise<Asset[]> =>
  request({
    method: 'GET',
    url: `${BASE_URL}/crypto_purchases/assets`,
  })
