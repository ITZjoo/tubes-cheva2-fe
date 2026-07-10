import api from '../../../services/api'

export async function getProducts() {
  // TODO: connect to product list endpoint
  return api.get('/products')
}

export async function getProduct(id) {
  // TODO: connect to product detail endpoint
  return api.get(`/products/${id}`)
}

export async function createProduct(payload) {
  // TODO: connect to create product endpoint
  return api.post('/products', payload)
}

export async function updateProduct(id, payload) {
  // TODO: connect to update product endpoint
  return api.put(`/products/${id}`, payload)
}

export async function deleteProduct(id) {
  // TODO: connect to delete product endpoint
  return api.delete(`/products/${id}`)
}
