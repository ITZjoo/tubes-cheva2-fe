import { Routes, Route, Navigate } from 'react-router-dom'
import LoginView from '../modules/auth/views/LoginView'
import RegisterView from '../modules/auth/views/RegisterView'
import OnboardingView from '../modules/auth/views/OnboardingView'
import ForgotPasswordView from '../modules/auth/views/ForgotPasswordView'
import ResetPasswordView from '../modules/auth/views/ResetPasswordView'
import DashboardView from '../modules/dashboard/views/DashboardView'
import ProductListView from '../modules/products/views/ProductListView'
import ProductFormView from '../modules/products/views/ProductFormView'
import OrderListView from '../modules/orders/views/OrderListView'
import ChatView from '../modules/chat/views/Chatview'
import HistoryView from '../modules/history/views/HistoryView'
import NotifikasiView from '../modules/notifikasi/views/NotifikasiView'
import PendapatanView from '../modules/pendapatan/views/PendapatanView'
import PengaturanView from '../modules/settings/views/PengaturanView'
import EditProfilAkunView from '../modules/settings/views/EditProfilAkunView'
import EditProfilLaundryView from '../modules/settings/views/EditProfilLaundryView'
import PengaturanNotifikasiView from '../modules/settings/views/PengaturanNotifikasiView'
import PengaturanPembayaranView from '../modules/settings/views/PengaturanPembayaranView'
import NotFoundView from '../modules/errors/views/NotFoundView'
import AccessDeniedView from '../modules/errors/views/AccessDeniedView'
import ServerErrorView from '../modules/errors/views/ServerErrorView'
import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes() {
  const onboarded = localStorage.getItem('laundry_onboarded') === 'true'

  return (
    <Routes>
      <Route
        path="/"
        element={
          onboarded ? (
            <Navigate to="/login" replace />
          ) : (
            <Navigate to="/onboarding" replace />
          )
        }
      />

      <Route path="/onboarding" element={<OnboardingView />} />
      <Route path="/login" element={<LoginView />} />
      <Route path="/register" element={<RegisterView />} />
      <Route path="/forgot-password" element={<ForgotPasswordView />} />
      <Route path="/reset-password" element={<ResetPasswordView />} />

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
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatView />
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
        path="/pendapatan"
        element={
          <ProtectedRoute>
            <PendapatanView />
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