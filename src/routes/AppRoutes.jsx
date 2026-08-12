import { Routes, Route, Navigate } from 'react-router-dom'
import LoginView from '../modules/auth/views/LoginView'
import RegisterView from '../modules/auth/views/RegisterView'
import DashboardView from '../modules/dashboard/views/DashboardView'
import ProductListView from '../modules/products/views/ProductListView'
import ProductFormView from '../modules/products/views/ProductFormView'
import OrderListView from '../modules/orders/views/OrderListView'
import OrderDetailView from '../modules/orders/views/OrderDetailView'
import HistoryView from '../modules/history/views/HistoryView'
import NotifikasiView from '../modules/notifikasi/views/NotifikasiView'
import PengaturanView from '../modules/pengaturan/views/PengaturanView'
import EditProfilAkunView from '../modules/pengaturan/views/EditProfilAkunView'
import EditProfilLaundryView from '../modules/pengaturan/views/EditProfilLaundryView'
import PengaturanNotifikasiView from '../modules/pengaturan/views/PengaturanNotifikasiView'
import PengaturanPembayaranView from '../modules/pengaturan/views/PengaturanPembayaranView'
import NotFoundView from '../modules/errors/views/NotFoundView'
import AccessDeniedView from '../modules/errors/views/AccessDeniedView'
import ServerErrorView from '../modules/errors/views/ServerErrorView'
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
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifikasi"
        element={
          <ProtectedRoute>
            <NotifikasiView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pengaturan"
        element={
          <ProtectedRoute>
            <PengaturanView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pengaturan/edit-akun"
        element={
          <ProtectedRoute>
            <EditProfilAkunView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pengaturan/edit-laundry"
        element={
          <ProtectedRoute>
            <EditProfilLaundryView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pengaturan/notifikasi"
        element={
          <ProtectedRoute>
            <PengaturanNotifikasiView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pengaturan/pembayaran"
        element={
          <ProtectedRoute>
            <PengaturanPembayaranView />
          </ProtectedRoute>
        }
      />

      <Route path="/403" element={<AccessDeniedView />} />
      <Route path="/500" element={<ServerErrorView />} />

      {/* Catch-all: unauthenticated visitors see the sidebar as a signed-out
          shell (PageShell handles that fine) rather than being bounced to
          /login, since a bad URL isn't the same as a bad session. */}
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  )
}