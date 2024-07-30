import request from './request'

export interface Crypto {
  id: string
  code: string
  name: string
  symbol: string
  network: string
  decimals: number
  address: string
  chainId: number
  icon: string
  networkDisplayName: string
}

export interface Fiat {
  id: string
  code: string
  name: string
  symbol: string
  icon: string
}

export interface AssetsResponse {
  message: {
    crypto: Crypto[]
    fiat: Fiat[]
  }
}

export const getAssetsApi = async (): Promise<AssetsResponse> =>
  request({
    method: 'GET',
    url: 'https://api.onramper.com/supported?type=buy',
  })
