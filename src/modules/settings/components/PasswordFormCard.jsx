import { useState } from 'react'
import Icon from '../../../components/ui/Icon'
import Input from '../../../components/ui/Input'
import Typography from '../../../components/ui/Typography'
import Button from '../../../components/ui/Button'

const FIELDS = [
  { key: 'oldPassword', label: 'Password Lama' },
  { key: 'newPassword', label: 'Password Baru' },
  { key: 'confirmPassword', label: 'Konfirmasi Password Baru' },
]

function PasswordVisibilityToggle({ visible, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex shrink-0 text-on-surface-variant transition-colors hover:text-on-surface"
      aria-label={visible ? 'Sembunyikan password' : 'Tampilkan password'}
    >
      <Icon name={visible ? 'visibility' : 'visibility_off'} size={20} />
    </button>
  )
}

// onSubmit(values) should return a Promise that resolves on success or
// rejects with an Error (whose .message is shown) on failure.
export default function PasswordFormCard({ onSubmit, onForgotPassword }) {
  const [values, setValues] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [visibility, setVisibility] = useState({ oldPassword: false, newPassword: false, confirmPassword: false })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  function handleChange(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }))
    setError(null)
    setSuccess(false)
  }

  function toggleVisibility(key) {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  async function handleSubmit() {
    setSuccess(false)
    if (!values.oldPassword) return setError('Password lama wajib diisi')
    if (values.newPassword.length < 6) return setError('Password baru minimal 6 karakter')
    if (values.newPassword !== values.confirmPassword) return setError('Konfirmasi password tidak cocok')

    setError(null)
    setSubmitting(true)
    try {
      await onSubmit?.(values)
      setValues({ oldPassword: '', newPassword: '', confirmPassword: '' })
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Gagal memperbarui password')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex w-full max-w-[467px] flex-col gap-4 rounded-2xl bg-on-primary p-[18px] shadow-[0px_1px_8px_0px_#00000026]">
      <Typography variant="label-lg" className="!text-[16px] !font-semibold text-on-background">
        Ganti Password
      </Typography>

      {FIELDS.map(({ key, label }) => (
        <div key={key} className="relative">
          <Input
            label={label}
            type={visibility[key] ? 'text' : 'password'}
            value={values[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            className="!h-9 !w-full !rounded-lg !border !border-[#89D0ED] !bg-[#B9EAFF4D] !py-[5px] !pl-[15px] !pr-9"
          />
          <span className="absolute bottom-1 right-3">
            <PasswordVisibilityToggle visible={visibility[key]} onToggle={() => toggleVisibility(key)} />
          </span>
        </div>
      ))}

      <button
        type="button"
        onClick={onForgotPassword}
        className="text-left !text-[14px] !font-medium !leading-[200%] text-primary"
      >
        Forgot Password ?
      </button>

      {error && <p className="text-body-sm font-semibold text-error">{error}</p>}
      {success && <p className="text-body-sm font-semibold text-success">Password berhasil diperbarui.</p>}

      <Button
        variant="primary"
        appearance="solid"
        onClick={handleSubmit}
        disabled={submitting}
        className="w-fit self-end !text-[12px]"
      >
        {submitting ? 'Menyimpan...' : 'Perbarui Password'}
      </Button>
    </div>
  )
}
