import { Routes, Route, Navigate } from 'react-router-dom'
import LoginView from '../modules/auth/views/LoginView'
import RegisterView from '../modules/auth/views/RegisterView'
import DashboardView from '../modules/dashboard/views/DashboardView'
import ProductListView from '../modules/products/views/ProductListView'
import ProductFormView from '../modules/products/views/ProductFormView'
import OrderListView from '../modules/orders/views/OrderListView'
import OrderDetailView from '../modules/orders/views/OrderDetailView'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginView />} />
      <Route path="/register" element={<RegisterView />} />

      <Route path="/dashboard" element={<DashboardView />} />

      <Route path="/products" element={<ProductListView />} />
      <Route path="/products/new" element={<ProductFormView />} />
      <Route path="/products/:id/edit" element={<ProductFormView />} />

      <Route path="/orders" element={<OrderListView />} />
      <Route path="/orders/:id" element={<OrderDetailView />} />
    </Routes>
  )
}
