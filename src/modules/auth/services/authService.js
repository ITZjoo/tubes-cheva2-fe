import api from '../../../services/api'

export async function login(credentials) {
  // TODO: connect to Sanctum login endpoint
  return api.post('/login', credentials)
}

export async function register(payload) {
  // TODO: connect to Sanctum register endpoint
  return api.post('/register', payload)
}

export async function logout() {
  // TODO: connect to Sanctum logout endpoint
  return api.post('/logout')
}
