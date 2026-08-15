import api from '../../../services/api'

// Self-service profile endpoints (now live per the deployed backend):
// PATCH /me for { name, phone } and PUT /me/password for
// { oldPassword, newPassword }, both authenticated as the current user.
export async function updateProfile(payload) {
  return api.patch('/me', payload)
}

export async function changePassword(payload) {
  return api.put('/me/password', payload)
}
