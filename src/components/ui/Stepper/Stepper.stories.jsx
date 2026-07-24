import { useState } from 'react'
import Stepper, { ORDER_STEPS } from './Stepper'
import Button from '../Button'

export default {
  title: 'UI/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  argTypes: {
    current: {
      control: 'select',
      options: ORDER_STEPS.map((step) => step.key),
    },
  },
}

export const Default = {
  args: { current: 'dicuci' },
}

export const Menunggu = {
  args: { current: 'menunggu' },
}

export const Selesai = {
  args: { current: 'selesai' },
}

export const Dibatalkan = {
  args: { current: 'dibatalkan' },
}

// Simulates an admin updating an order's status: click any step to jump to
// it directly, or step through sequentially with the buttons.
function InteractiveDemo() {
  const [current, setCurrent] = useState(ORDER_STEPS[0].key)
  const currentIndex = ORDER_STEPS.findIndex((step) => step.key === current)

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
        <Stepper current={current} onStepClick={setCurrent} />
      </div>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          appearance="outline"
          disabled={currentIndex <= 0}
          onClick={() => setCurrent(ORDER_STEPS[currentIndex - 1].key)}
        >
          Sebelumnya
        </Button>
        <Button
          disabled={currentIndex >= ORDER_STEPS.length - 1}
          onClick={() => setCurrent(ORDER_STEPS[currentIndex + 1].key)}
        >
          Berikutnya
        </Button>
      </div>
    </div>
  )
}

export const Interactive = {
  render: () => <InteractiveDemo />,
}

// Mirrors the design spec's reference sheet: one row per status, each with
// that status highlighted as the current step.
export const AllStates = {
  render: () => (
    <div className="flex flex-col gap-4">
      {ORDER_STEPS.map((step) => (
        <div key={step.key} className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
          <Stepper current={step.key} />
        </div>
      ))}
    </div>
  ),
}
