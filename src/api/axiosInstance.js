import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || ''

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Attach token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('pg_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// basic response error handling
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    // optional: handle 401 -> logout
    return Promise.reject(err)
  }
)

export default instance
