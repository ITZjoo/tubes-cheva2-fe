import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Icon from '../../../components/ui/Icon'

export default function PasswordInput({ label, value, onChange, error, placeholder }) {
  const [visible, setVisible] = useState(false)

  return (
    <Input
      variant="outlined"
      label={label}
      type={visible ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      error={error}
      placeholder={placeholder}
      endAdornment={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="inline-flex shrink-0 text-on-surface-variant transition-colors hover:text-on-surface"
          aria-label={visible ? 'Sembunyikan password' : 'Tampilkan password'}
        >
          <Icon name={visible ? 'visibility' : 'visibility_off'} size={20} />
        </button>
      }
    />
  )
}
