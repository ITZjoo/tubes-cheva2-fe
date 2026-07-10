import { useState } from 'react'
import { Link } from 'react-router-dom'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function LoginView() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.email) nextErrors.email = 'Email wajib diisi'
    if (!form.password) nextErrors.password = 'Password wajib diisi'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    // TODO: call authService.login(form)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-sm"
      >
        <h1 className="font-heading text-xl font-bold text-on-surface">Masuk</h1>
        <p className="text-sm text-on-surface-variant">Utama Laundry Admin Panel</p>

        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange('email')}
          error={errors.email}
          placeholder="admin@utamalaundry.com"
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange('password')}
          error={errors.password}
          placeholder="********"
        />

        <Button type="submit" variant="primary" size="lg">
          Masuk
        </Button>

        <p className="text-center text-sm text-on-surface-variant">
          Belum punya akun?{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Daftar
          </Link>
        </p>
      </form>
    </div>
  )
}
