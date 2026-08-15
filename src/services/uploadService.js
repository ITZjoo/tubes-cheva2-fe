import api from './api'

// Backend contract (tubes-cheva2-be src/routes/upload.routes.js):
// POST /upload, multipart field name "file" -> { url: "/uploads/<filename>" }
// Requires staff auth (same as everything else behind the api client).
export async function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  const { url } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return url
}
