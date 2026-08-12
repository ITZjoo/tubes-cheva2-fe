import { useState } from 'react'
import TimeSettingPopover from './TimeSettingPopover'

export default {
  title: 'UI/TimeSettingPopover',
  component: TimeSettingPopover,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[360px] rounded-xl bg-surface-container-lowest p-4 shadow-sm">
        <Story />
      </div>
    ),
  ],
}

export const Default = {
  args: { hour: 8, minute: 30 },
}

function InteractiveDemo() {
  const [time, setTime] = useState({ hour: 8, minute: 30 })
  return (
    <div className="flex flex-col gap-2">
      <TimeSettingPopover hour={time.hour} minute={time.minute} onSave={setTime} />
      <span className="text-body-sm text-outline">
        Tersimpan: {String(time.hour).padStart(2, '0')}:{String(time.minute).padStart(2, '0')}
      </span>
    </div>
  )
}

export const Interactive = {
  render: () => <InteractiveDemo />,
}
