import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import Typography from '../../../components/ui/Typography'
import * as authService from '../services/authService'
import logoOnly from '../../../assets/illustrations/Logo On Boarding.svg'

export default function ResetPasswordView() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) {
      setError('Token reset tidak ditemukan')
      return
    }
    if (newPassword.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok')
      return
    }
    setError('')
    setLoading(true)
    try {
      await authService.resetPassword(token, newPassword)
      navigate('/login', { state: { resetSuccess: true } })
    } catch (err) {
      setError(err.message || 'Gagal mereset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f8fa] p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 border border-outline-variant/30">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center gap-2 mb-1.5">
            <img src={logoOnly} alt="Logo" className="h-8 w-8 object-contain" />
            <span className="font-heading text-h3 text-on-surface font-bold">Reset Password</span>
          </div>
          <p className="text-body-sm text-on-surface-variant mt-1">Masukkan password baru Anda.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            variant="outlined"
            label="Password Baru"
            type="password"
            placeholder="Password baru"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full"
          />
          <Input
            variant="outlined"
            label="Konfirmasi Password"
            type="password"
            placeholder="Ulangi password baru"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full"
          />

          {error && (
            <Typography variant="body-sm" className="text-error">
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="primary"
            appearance="solid"
            disabled={loading}
            className="w-full py-3 bg-[#0a6780] hover:bg-[#08556a] text-white shadow-sm font-semibold rounded-lg"
          >
            {loading ? 'Memproses...' : 'Reset Password'}
          </Button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-body-sm text-[#0a6780] font-bold hover:underline text-center"
          >
            Kembali ke Login
          </button>
        </form>
      </div>
    </div>
  )
}
