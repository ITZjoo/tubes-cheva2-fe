/**
 * Pill toggle switch. Track: 72x32, radius 14, primary bg when on.
 * Knob: ~24.4px circle, white, slides between left-4 (off) and left-11 (on).
 */
export default function Toggle({ checked = false, onChange, disabled = false, className = '', ...rest }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={[
        'relative h-8 w-[72px] shrink-0 rounded-[14px] shadow-[inset_0px_0px_3px_0px_rgba(10,103,128,0.4)] transition-colors duration-200',
        checked ? 'bg-primary' : 'bg-outline-variant',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      <span
        className="absolute top-1 h-[24.38px] w-[24.38px] rounded-full bg-white shadow-[0px_1px_1.6px_0px_#0000004A] transition-all duration-200"
        style={{ left: checked ? '44px' : '4px' }}
      />
    </button>
  )
}