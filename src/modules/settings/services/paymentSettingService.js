import api from '../../../services/api'

// Backend contract (src/validators/paymentSetting.validator.js on tubes-cheva2-be):
// GET /payment-settings -> { qrisEnabled, qrisMerchantName, qrisNmid, qrisImageUrl,
//   cashEnabled, transferEnabled, bankAccounts: [{ id?, bankName, noRekening, namaPemilik, enabled }] }
// PUT /payment-settings <- same shape (all fields optional; send the full document,
// bankAccounts replaces the stored list wholesale).
export async function getPaymentSettings() {
  return api.get('/payment-settings')
}

export async function updatePaymentSettings(payload) {
  return api.put('/payment-settings', payload)
}
