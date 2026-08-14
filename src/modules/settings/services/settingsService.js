import api from '../../../services/api'

// Backend contract these two calls expect (not implemented yet as of 2026-08 —
// only GET /me and an admin-only PUT /users/:id exist): a self-service
// PATCH /me for { name, phone } and PUT /me/password for
// { oldPassword, newPassword }, both authenticated as the current user.
export async function updateProfile(payload) {
  return api.patch('/me', payload)
}

export async function changePassword(payload) {
  return api.put('/me/password', payload)
}

export function getLaundryProfile() {
  return api.get('/laundry-profile')
}

export function updateLaundryProfile(payload) {
  return api.put('/laundry-profile', payload)
}

export function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function getPaymentSettings() {
  return api.get('/payment-settings')
}

export function updatePaymentSettings(payload) {
  return api.put('/payment-settings', payload)
}
