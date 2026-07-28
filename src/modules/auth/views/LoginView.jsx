import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Typography from '../../../components/ui/Typography'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { useAuth } from '../../../context/AuthContext'
import * as authService from '../services/authService'

export default function LoginView() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email wajib diisi'
    if (!form.password.trim()) errs.password = 'Password wajib diisi'
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setSubmitError('')
    setLoading(true)
    try {
      const { token, user } = await authService.login(form)
      login(user, token)
      navigate('/dashboard')
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <Typography.H1>Masuk</Typography.H1>
          <Typography.BodyMd className="text-on-surface-variant">
            Masuk ke akun UtamaLaundry Anda.
          </Typography.BodyMd>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            variant="outlined"
            label="Email"
            type="email"
            placeholder="admin@cheva.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
          />
          <Input
            variant="outlined"
            label="Password"
            type="password"
            placeholder="Masukkan password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
          />

          {submitError && (
            <p className="text-body-sm text-error" role="alert">
              {submitError}
            </p>
          )}

          <Button type="submit" variant="primary" appearance="solid" disabled={loading} className="mt-2 w-full">
            {loading ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>

        <Typography.BodyMd className="mt-4 text-center text-on-surface-variant">
          Belum punya akun?{' '}
          <Typography.Link as={Link} to="/register">
            Daftar
          </Typography.Link>
        </Typography.BodyMd>
      </div>
    </div>
  )
}
