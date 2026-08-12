import { useState } from 'react'
import TimeStepper from './TimeStepper'

export default {
  title: 'UI/TimeStepper',
  component: TimeStepper,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex bg-surface p-10">
        <Story />
      </div>
    ),
  ],
}

export const Hour = {
  args: { value: 8, max: 23, label: 'jam' },
}

export const Minute = {
  args: { value: 30, max: 59, label: 'menit' },
}

function InteractiveDemo() {
  const [value, setValue] = useState(8)
  return <TimeStepper value={value} max={23} label="jam" onChange={setValue} />
}

export const Interactive = {
  render: () => <InteractiveDemo />,
}
