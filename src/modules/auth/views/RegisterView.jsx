import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Typography from '../../../components/ui/Typography'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import * as authService from '../services/authService'

export default function RegisterView() {
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'Nama wajib diisi'
    if (!form.email.trim()) errs.email = 'Email wajib diisi'
    if (!form.password.trim() || form.password.length < 6) errs.password = 'Password minimal 6 karakter'
    if (form.phone && form.phone.trim().length < 10) errs.phone = 'No. telepon minimal 10 digit'
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setSubmitError('')
    setLoading(true)
    try {
      await authService.register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      })
      navigate('/login')
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
          <Typography.H1>Daftar</Typography.H1>
          <Typography.BodyMd className="text-on-surface-variant">
            Buat akun staff UtamaLaundry.
          </Typography.BodyMd>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            variant="outlined"
            label="Nama"
            placeholder="Nama lengkap"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
          />
          <Input
            variant="outlined"
            label="Email"
            type="email"
            placeholder="staff@cheva.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
          />
          <Input
            variant="outlined"
            label="No. Handphone"
            type="tel"
            placeholder="081234567890"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            error={errors.phone}
          />
          <Input
            variant="outlined"
            label="Password"
            type="password"
            placeholder="Minimal 6 karakter"
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
            {loading ? 'Memproses...' : 'Daftar'}
          </Button>
        </form>

        <Typography.BodyMd className="mt-4 text-center text-on-surface-variant">
          Sudah punya akun?{' '}
          <Typography.Link as={Link} to="/login">
            Masuk
          </Typography.Link>
        </Typography.BodyMd>
      </div>
    </div>
  )
}
