import { useState } from 'react'
import { Link } from 'react-router-dom'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function RegisterView() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.name) nextErrors.name = 'Nama wajib diisi'
    if (!form.email) nextErrors.email = 'Email wajib diisi'
    if (!form.password) nextErrors.password = 'Password wajib diisi'
    if (form.passwordConfirmation !== form.password) {
      nextErrors.passwordConfirmation = 'Konfirmasi password tidak sama'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    // TODO: call authService.register(form)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-sm"
      >
        <h1 className="font-heading text-xl font-bold text-on-surface">Daftar</h1>
        <p className="text-sm text-on-surface-variant">Buat akun admin Utama Laundry</p>

        <Input
          label="Nama"
          value={form.name}
          onChange={handleChange('name')}
          error={errors.name}
          placeholder="Nama lengkap"
        />
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
        <Input
          label="Konfirmasi Password"
          type="password"
          value={form.passwordConfirmation}
          onChange={handleChange('passwordConfirmation')}
          error={errors.passwordConfirmation}
          placeholder="********"
        />

        <Button type="submit" variant="primary" size="lg">
          Daftar
        </Button>

        <p className="text-center text-sm text-on-surface-variant">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Masuk
          </Link>
        </p>
      </form>
    </div>
  )
}
