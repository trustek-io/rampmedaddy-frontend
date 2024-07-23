import axios, { AxiosRequestConfig } from 'axios'

export const API_SERVER_URL = 'https://pay.crypto.com'
export const BASE_URL = `${API_SERVER_URL}/api`
const CRYPTO_COM_TOKEN =
  process.env.NODE_ENV === 'development'
    ? 'pk_test_VyzWBzcYZkKxeFg5H5Srjr7t'
    : process.env.REACT_APP_CRYPTO_COM_TOKEN

export const axiosInstance = axios.create({ baseURL: BASE_URL })

const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const resp = await axiosInstance.request(config)

  return resp.data
}

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
  config.headers!['Authorization'] = `pk_prod_01J3CZHG87RNJV6K88PJ5G2VJK`
  return config
})

export default request
