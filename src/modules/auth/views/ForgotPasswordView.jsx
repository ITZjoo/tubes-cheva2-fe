import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import Typography from '../../../components/ui/Typography'
import * as authService from '../services/authService'
import logoOnly from '../../../assets/illustrations/Logo On Boarding.svg'

export default function ForgotPasswordView() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [resetToken, setResetToken] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Email wajib diisi')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await authService.forgotPassword(email)
      setResetToken(res.resetToken ?? null)
      setMessage(
        res.resetToken
          ? 'Token reset berhasil dibuat. Salin token di bawah lalu lanjut ke reset password.'
          : 'Link reset telah dibuat (cek email Anda).'
      )
    } catch (err) {
      setError(err.message || 'Gagal memproses permintaan')
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
            <span className="font-heading text-h3 text-on-surface font-bold">Lupa Password</span>
          </div>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Masukkan email akun Anda untuk membuat token reset.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            variant="outlined"
            label="Email address"
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            className="w-full"
          />

          {message && (
            <Typography variant="body-sm" className="text-primary">
              {message}
            </Typography>
          )}

          {resetToken && (
            <div className="flex flex-col gap-2 rounded-lg bg-surface-container-low border border-outline-variant p-3">
              <span className="text-label-sm text-on-surface-variant font-semibold">Token reset:</span>
              <code className="text-body-sm break-all text-on-surface select-all">{resetToken}</code>
              <Button
                type="button"
                variant="primary"
                appearance="solid"
                className="w-full"
                onClick={() => navigate(`/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`)}
              >
                Lanjut ke Reset Password
              </Button>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            appearance="solid"
            disabled={loading}
            className="w-full py-3 bg-[#0a6780] hover:bg-[#08556a] text-white shadow-sm font-semibold rounded-lg"
          >
            {loading ? 'Memproses...' : 'Buat Token Reset'}
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
