import axios from 'axios'

const TOKEN_KEY = 'utama_laundry_token'

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Backend always responds with { success, data, pagination? } on success or
// { success: false, message, errors? } on failure. Unwrap that envelope here
// so callers work with plain data instead of repeating `.data.data` everywhere.
api.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data && typeof data === 'object' && 'data' in data) {
      return data.pagination ? { data: data.data, pagination: data.pagination } : data.data
    }
    return data
  },
  (error) => {
    const payload = error.response?.data
    const message = payload?.message || error.message || 'Terjadi kesalahan'
    const normalized = new Error(message)
    normalized.status = error.response?.status
    normalized.errors = payload?.errors
    return Promise.reject(normalized)
  }
)

export default api
