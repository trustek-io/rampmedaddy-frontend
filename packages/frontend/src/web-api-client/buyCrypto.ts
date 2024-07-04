import request, { BASE_URL } from './request'

export interface BuyCryptoArgs {
  currency: string
  fiat_amount: number
  order_currency: string
  network: string
  wallet_address: string
  return_url: string
  cancel_url: string
}

export interface BuyCryptoResponse {
  id: string
  status: string
  payment_id: null | string | number
  payout_id: null | string | number
  customer_account_id: null | string | number
  customer_account_email: null | string
  live_mode: boolean
  amount: string
  amount_in_usd: string
  currency: string
  network: string
  network_for_display: string
  wallet_address: string
  target_amount_fractional: number
  target_amount: string
  target_currency: string
  order_currency: string
  quotation_id: string
  account_id: string
  team_id: string
  merchant_name: string
  payment_channel: null | string
  sub_quotations: {
    USDC: {
      id: string
      value: number
      currency: string
      amount: number
      rate: number
      side: string
      executed: boolean
      created: number
      target_currency: string
      target_amount: number
      rate_timestamp: number
      merchant_reference: string
      original_target_amount: null | number | string
    }
  }
  quotation_timestamp: number
  rate: string
  transaction_fee: string
  network_fee: string
  total_amount: string
  expired_at: number
  merchant_reference_id: null | string | number
  redirect_url: string
  cancel_url: string
  return_url: string
  result: null | string
  ref_user_id: null | string
  device_id: null | string
  session_id: null | string
  payout_transaction_id: null | string
  purchase_error: null | string
  fiat_amount: number
  exceeds_max_number_of_retry: boolean
  chain: {
    id: string
    name: string
    symbol: string
    ethereum_chain_id: number
    network_type: string
    address_type: string
    if_use_destination_tag: boolean
    explorer_urls: {
      tx: string
      address: string
    }
    explorer_url: string
    rpc_url: string
    processing_time: number
    native_currency: {
      symbol: string
      name: string
      decimals: number
    }
  }
  transaction_limit: {
    us: {
      max_transaction_limit: number
      kyc_transaction_threshold: number
    }
    others: {
      max_transaction_limit: number
      kyc_transaction_threshold: number
    }
  }
  transaction_config: {
    us: Record<any, any>
    others: Record<any, any>
  }
  pay_method: null | string
  last_pay_error: null | string
  retryable: boolean
  cdc_order_id: null | string
  cdc_redirect_url: null | string
  feature_flags: string[]
}

export const buyCryptoApi = async (
  args: BuyCryptoArgs
): Promise<BuyCryptoResponse> =>
  request({
    method: 'POST',
    url: `${BASE_URL}/crypto_purchases`,
    data: args,
  })
