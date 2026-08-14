import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Typography from '../../../components/ui/Typography'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { useAuth } from '../../../context/AuthContext'
import * as authService from '../services/authService'
import logoOnly from '../../../assets/illustrations/Logo On Boarding.svg'
import loginIllustration from '../../../assets/illustrations/Frame 418.svg'

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
      setSubmitError(err.message || 'Login gagal, silakan periksa kembali email dan password Anda')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#f4f8fa]">
      {/* 1. DESKTOP VIEW: Split Screen Layout */}
      <div className="hidden md:flex min-h-screen w-full flex-row">
        {/* Left Side: Form Container */}
        <div className="flex w-[50%] lg:w-[45%] flex-col justify-between bg-transparent p-12 lg:p-20 min-h-screen">
          {/* Top Logo */}
          <div className="flex items-center gap-2.5">
            <img src={logoOnly} alt="Logo" className="h-8 w-8 object-contain" />
            <span className="font-heading text-subtitle text-primary tracking-wide">Utama Laundry</span>
          </div>

          {/* Center Login Form */}
          <div className="my-auto w-full max-w-sm mx-auto">
            <h1 className="text-display-sm text-primary font-bold leading-tight tracking-tight">
              Haloo,<br />
              <span className="whitespace-nowrap">Selamat Datang Kembali!</span>
            </h1>
            <p className="text-body-md text-on-surface-variant mt-2 mb-8">
              Silahkan masukkan username dan password
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <Input
                variant="outlined"
                label="Username"
                type="text"
                placeholder="Username"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={errors.email}
                className="w-full"
              />

              <div className="flex flex-col gap-2">
                <Input
                  variant="outlined"
                  label="Password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  error={errors.password}
                  helperText="Password terdiri dari *, !, #, A-Z, a-z"
                  className="w-full"
                />
                <a
                  href="#"
                  className="text-body-sm text-[#0a6780] font-bold hover:underline self-start mt-1"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate('/forgot-password')
                  }}
                >
                  Forgot Password ?
                </a>
              </div>

              {submitError && (
                <p className="text-body-sm text-error" role="alert">
                  {submitError}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                appearance="solid"
                disabled={loading}
                className="w-40 py-2.5 bg-[#0a6780] hover:bg-[#08556a] text-white shadow-sm font-semibold rounded-lg mt-2"
              >
                {loading ? 'Memproses...' : 'Login'}
              </Button>
            </form>
          </div>
        </div>

        {/* Right Side: Illustration */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8 lg:p-16 bg-transparent">
          <div 
            className="w-full h-full bg-no-repeat transition-all duration-500"
            style={{
              backgroundImage: `url("${loginIllustration}")`,
              backgroundPosition: 'center',
              backgroundSize: 'contain',
            }}
          />
        </div>
      </div>

      {/* 2. MOBILE VIEW: Card Centered Layout */}
      <div className="flex md:hidden flex-col items-center justify-center min-h-screen bg-[#f4f8fa] p-5">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 border border-outline-variant/30">
          {/* Logo and Title */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="flex items-center gap-2 mb-1.5">
              <img src={logoOnly} alt="Logo" className="h-8 w-8 object-contain" />
              <span className="font-heading text-h3 text-on-surface font-bold">Login</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              variant="outlined"
              label="Email address"
              type="email"
              placeholder="example@gmail.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              className="w-full"
            />

            <div className="relative w-full">
              <Input
                variant="outlined"
                label="Password"
                type="password"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
                className="w-full"
              />
              <a
                href="#"
                className="absolute right-3.5 top-3 text-body-sm text-[#0a6780] font-bold hover:underline z-10"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/forgot-password')
                }}
              >
                Forgot?
              </a>
            </div>

            {submitError && (
              <p className="text-body-sm text-error" role="alert">
                {submitError}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              appearance="solid"
              disabled={loading}
              className="w-full py-3 bg-[#0a6780] hover:bg-[#08556a] text-white shadow-sm font-semibold rounded-lg mt-2"
            >
              {loading ? 'Memproses...' : 'Log in'}
            </Button>

            <Button
              type="button"
              variant="primary"
              appearance="outline"
              disabled={loading}
              className="w-full py-3 border border-outline-variant text-on-surface hover:bg-surface font-semibold rounded-lg"
              onClick={() => navigate('/register')}
            >
              Sign up
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
