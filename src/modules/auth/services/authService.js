import api from '../../../services/api'

export async function login(credentials) {
  return api.post('/login', credentials)
}

export async function register(payload) {
  return api.post('/register', payload)
}

export async function logout() {
  return api.post('/logout')
}

export async function getProfile() {
  return api.get('/me')
}
