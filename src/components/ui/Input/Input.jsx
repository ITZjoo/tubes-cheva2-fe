export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  ...rest
}) {
  return (
    <label className="block text-left">
      {label && (
        <span className="font-heading mb-1 block text-sm font-medium text-on-surface">
          {label}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-md border px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary ${
          error ? 'border-error' : 'border-outline'
        }`}
        {...rest}
      />
      {error && <span className="mt-1 block text-xs text-error">{error}</span>}
    </label>
  )
}
