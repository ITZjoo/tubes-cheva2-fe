import api from '../../../services/api'

// Self-service profile endpoints (confirmed live against src/services/auth.service.js
// on tubes-cheva2-be main): PATCH /me for { name, phone, photoUrl, email } and
// PUT /me/password for { oldPassword, newPassword }, both authenticated as the
// current user (any role — NOT the admin-only PUT /users/:id). The backend does
// verify oldPassword via bcrypt.compare before accepting a new one.
export async function updateProfile(payload) {
  return api.patch('/me', payload)
}

export async function changePassword(payload) {
  return api.put('/me/password', payload)
}