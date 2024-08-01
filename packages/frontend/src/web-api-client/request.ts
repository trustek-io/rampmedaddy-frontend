import axios, { AxiosRequestConfig } from 'axios'

export const API_SERVER_URL = 'https://pay.crypto.com'
export const BASE_URL = `${API_SERVER_URL}/api`

export const axiosInstance = axios.create({ baseURL: BASE_URL })

const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const resp = await axiosInstance.request(config)

  return resp.data
}

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
  config.headers!['Authorization'] = process.env.REACT_APP_ONRAMP_TOKEN
  return config
})

export default request
