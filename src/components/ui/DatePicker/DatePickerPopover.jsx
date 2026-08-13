import Popover from '../Popover'
import Icon from '../Icon'
import DatePicker from './DatePicker'

export default function DatePickerPopover({
  value = null,
  onChange,
  placeholder = 'Pilih tanggal',
  mode = 'single',
  className = '',
}) {
  const isRange = mode === 'range'
  
  // Format tanggal untuk ditampilkan pada tombol
  const displayLabel = value
    ? isRange
      ? `${value.from ? value.from.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : ''} - ${
          value.to ? value.to.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : ''
        }`
      : value.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
    : placeholder

  return (
    <Popover
      align="start"
      className={className}
      trigger={({ toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className="bg-surface-container-lowest border border-outline-variant px-4 py-2.5 rounded-xl text-label-sm font-bold flex items-center gap-2.5 hover:bg-surface-container transition-all shadow-sm text-on-surface hover:scale-[1.02] cursor-pointer"
        >
          <Icon name="calendar_today" size={18} className="text-primary" />
          <span>{displayLabel}</span>
          <span className="text-outline/45">|</span>
          <Icon name="event" size={18} className="text-on-surface-variant" />
        </button>
      )}
    >
      {({ close }) => (
        <DatePicker
          mode={mode}
          value={value}
          onChange={(val) => {
            onChange?.(val)
            // Tutup popover otomatis jika mode single atau jika rentang tanggal range sudah lengkap terisi
            if (mode === 'single') {
              close()
            } else if (mode === 'range' && val?.from && val?.to) {
              close()
            }
          }}
        />
      )}
    </Popover>
  )
}
