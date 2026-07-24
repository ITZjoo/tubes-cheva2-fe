import { useState } from 'react'
import DatePickerPopover from './DatePickerPopover'

export default {
  title: 'UI/DatePicker/Popover',
  component: DatePickerPopover,
  tags: ['autodocs'],
}

function InteractiveDemo() {
  const [date, setDate] = useState(null)

  return (
    <div className="flex flex-col items-start gap-3">
      <DatePickerPopover value={date} onChange={setDate} />
      <span className="text-body-md text-on-surface-variant">
        {date ? `Tanggal terpilih: ${date.toLocaleDateString('id-ID', { dateStyle: 'full' })}` : 'Belum ada tanggal dipilih'}
      </span>
    </div>
  )
}

export const Interactive = {
  render: () => <InteractiveDemo />,
}

export const WithPreselectedDate = {
  render: () => <DatePickerPopover value={new Date(2025, 7, 20)} onChange={() => {}} />,
}

// Forces each corner explicitly via the `placement` prop. The triggers that
// open downward sit at the top of the canvas and the ones that open upward
// sit at the bottom, so there's empty room in the middle for every panel to
// expand into without covering another trigger (the panel itself floats via
// a portal now, but two triggers stacked closer than the panel's height will
// still visually overlap each other on screen — that's normal popover
// behavior, not a positioning bug).
export const ManualPlacements = {
  render: () => (
    <div className="relative h-[640px] w-[820px]">
      <div className="absolute left-0 top-0">
        <DatePickerPopover placement="bottom-start" placeholder="bottom-start" onChange={() => {}} />
      </div>
      <div className="absolute right-0 top-0">
        <DatePickerPopover placement="bottom-end" placeholder="bottom-end" onChange={() => {}} />
      </div>
      <div className="absolute bottom-0 left-0">
        <DatePickerPopover placement="top-start" placeholder="top-start" onChange={() => {}} />
      </div>
      <div className="absolute bottom-0 right-0">
        <DatePickerPopover placement="top-end" placeholder="top-end" onChange={() => {}} />
      </div>
    </div>
  ),
}

// No `placement` prop — the trigger sits at each viewport edge so the
// auto-flip logic has to pick the opposite side to avoid clipping.
export const AutoFlipAtEdges = {
  render: () => (
    <div className="flex h-[80vh] flex-col justify-between">
      <div className="flex justify-between">
        <DatePickerPopover placeholder="top-left corner" onChange={() => {}} />
        <DatePickerPopover placeholder="top-right corner" onChange={() => {}} />
      </div>
      <div className="flex justify-between">
        <DatePickerPopover placeholder="bottom-left corner" onChange={() => {}} />
        <DatePickerPopover placeholder="bottom-right corner" onChange={() => {}} />
      </div>
    </div>
  ),
}
