import axios, { AxiosRequestConfig } from 'axios'

export const API_SERVER_URL = 'https://pay.crypto.com'
// process.env.NODE_ENV === 'development'
//   ? 'https://pay.crypto.com'
//   : process.env.NEXT_PUBLIC_API_URL

export const BASE_URL = `${API_SERVER_URL}/api`

export const axiosInstance = axios.create({ baseURL: BASE_URL })

const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const resp = await axiosInstance.request(config)

  return resp.data
}

// const prod_bearer = 'pk_live_35juVapmZ6a3bbnGWm69XyYh'
const dev_bearer = 'pk_test_VyzWBzcYZkKxeFg5H5Srjr7t'

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
  config.headers!['Authorization'] = `Bearer ${dev_bearer}`
  return config
})

export default request
