import { Routes, Route, Navigate } from 'react-router-dom'
import LoginView from '../modules/auth/views/LoginView'
import RegisterView from '../modules/auth/views/RegisterView'
import DashboardView from '../modules/dashboard/views/DashboardView'
import ProductListView from '../modules/products/views/ProductListView'
import ProductFormView from '../modules/products/views/ProductFormView'
import OrderListView from '../modules/orders/views/OrderListView'
import OrderDetailView from '../modules/orders/views/OrderDetailView'
import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginView />} />
      <Route path="/register" element={<RegisterView />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <ProductListView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/new"
        element={
          <ProtectedRoute>
            <ProductFormView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/:id/edit"
        element={
          <ProtectedRoute>
            <ProductFormView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrderListView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute>
            <OrderDetailView />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
