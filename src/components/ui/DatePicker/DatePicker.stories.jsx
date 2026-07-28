import { useState } from 'react'
import DatePicker from './DatePicker'

export default {
  title: 'UI/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
}

export const Default = {
  args: {},
}

export const WithSelectedDate = {
  args: { value: new Date(2025, 7, 20), defaultMonth: new Date(2025, 7, 1) },
}

function InteractiveDemo() {
  const [date, setDate] = useState(null)

  return (
    <div className="flex flex-col items-start gap-3">
      <DatePicker value={date} onChange={setDate} />
      <span className="text-body-md text-on-surface-variant">
        {date ? `Tanggal terpilih: ${date.toLocaleDateString('id-ID', { dateStyle: 'full' })}` : 'Belum ada tanggal dipilih'}
      </span>
    </div>
  )
}

export const Interactive = {
  render: () => <InteractiveDemo />,
}

function RangeDemo() {
  const [range, setRange] = useState({ from: null, to: null })

  const label = () => {
    if (!range.from) return 'Belum ada rentang dipilih'
    if (!range.to) return `Mulai: ${range.from.toLocaleDateString('id-ID', { dateStyle: 'medium' })}`
    return `${range.from.toLocaleDateString('id-ID', { dateStyle: 'medium' })} — ${range.to.toLocaleDateString('id-ID', { dateStyle: 'medium' })}`
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <DatePicker mode="range" value={range} onChange={setRange} />
      <span className="text-body-md text-on-surface-variant">{label()}</span>
    </div>
  )
}

export const RangeMode = {
  render: () => <RangeDemo />,
}
