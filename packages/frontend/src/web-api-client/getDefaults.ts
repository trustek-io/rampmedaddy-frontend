import request from './request'

export interface Default {
  amount: number
  paymentMethod: string
  provider: string
  source: string
  target: string
}

export interface DefaultsResponse {
  message: {
    defaults: Record<string, Default>
    recommended: {
      amount: number
      paymentMethod: string
      provider: string
      source: string
      target: string
      country: string
    }
  }
}

export const getDefaultsApi = async (): Promise<DefaultsResponse> =>
  request({
    method: 'GET',
    url: 'https://api.onramper.com/supported/defaults/all',
    params: { type: 'buy' },
  })
