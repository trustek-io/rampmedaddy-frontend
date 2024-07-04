import axios, { AxiosRequestConfig } from 'axios'

export const API_SERVER_URL = 'https://pay.crypto.com'
export const BASE_URL = `${API_SERVER_URL}/api`
const CRYPTO_COM_TOKEN = process.env.REACT_APP_CRYPTO_COM_TOKEN

export const axiosInstance = axios.create({ baseURL: BASE_URL })

const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const resp = await axiosInstance.request(config)

  return resp.data
}

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
  config.headers!['Authorization'] = `Bearer ${CRYPTO_COM_TOKEN}`
  return config
})

export default request
