import { useState } from 'react'
import Toggle from './Toggle'

export default {
  title: 'UI/Toggle',
  component: Toggle,
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}

export const On = {
  args: { checked: true },
}

export const Off = {
  args: { checked: false },
}

export const Disabled = {
  args: { checked: true, disabled: true },
}

export const Interactive = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked ?? false)
    return <Toggle {...args} checked={checked} onChange={setChecked} />
  },
  args: { checked: false },
}