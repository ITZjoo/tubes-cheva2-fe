import api from '../../../services/api'

// Backend contract (src/validators/laundryProfile.validator.js on tubes-cheva2-be):
// GET  /laundry-profile -> { name, address, info, operationalDays, openTime, closeTime, whatsapp, email, links }
// PUT  /laundry-profile <- same shape, all fields optional
export async function getLaundryProfile() {
  return api.get('/laundry-profile')
}

export async function updateLaundryProfile(payload) {
  return api.put('/laundry-profile', payload)
}
