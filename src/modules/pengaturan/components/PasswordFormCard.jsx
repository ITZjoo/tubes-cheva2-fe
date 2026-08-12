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

export default function PasswordFormCard({ onSubmit, onForgotPassword }) {
  const [values, setValues] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [visibility, setVisibility] = useState({ oldPassword: false, newPassword: false, confirmPassword: false })

  function handleChange(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function toggleVisibility(key) {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function handleSubmit() {
    onSubmit?.(values)
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

      <Button variant="primary" appearance="solid" onClick={handleSubmit} className="w-fit self-end !text-[12px]">
        Perbarui Password
      </Button>
    </div>
  )
}