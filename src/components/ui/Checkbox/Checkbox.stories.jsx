import { useState } from 'react'
import Checkbox from './Checkbox'

export default {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    color: { control: { type: 'inline-radio' }, options: ['primary', 'error'] },
  },
}

function ControlledCheckbox(args) {
  const [checked, setChecked] = useState(args.checked ?? false)
  return <Checkbox {...args} checked={checked} onChange={(e) => setChecked(e.target.checked)} />
}

export const Playground = {
  render: (args) => <ControlledCheckbox {...args} />,
  args: { color: 'primary', checked: false, indeterminate: false, disabled: false },
}

// Every state × color × interaction combo from the design spec. Hover,
// focus, and press are real CSS states here — try interacting with the
// checkboxes below instead of looking at static swatches.
export const AllStates = {
  render: () => {
    const rows = [
      { checked: true, indeterminate: false, label: 'Checked' },
      { checked: false, indeterminate: true, label: 'Indeterminate' },
      { checked: false, indeterminate: false, label: 'Unchecked' },
    ]
    const colors = ['primary', 'error']

    return (
      <table style={{ borderSpacing: 24 }}>
        <thead>
          <tr>
            <th />
            <th style={{ textAlign: 'left' }}>Enabled</th>
            <th style={{ textAlign: 'left' }}>Disabled</th>
          </tr>
        </thead>
        <tbody>
          {colors.map((color) =>
            rows.map((row) => (
              <tr key={`${color}-${row.label}`}>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>
                  {color} / {row.label}
                </td>
                <td>
                  <Checkbox color={color} checked={row.checked} indeterminate={row.indeterminate} onChange={() => {}} />
                </td>
                <td>
                  <Checkbox color={color} checked={row.checked} indeterminate={row.indeterminate} disabled onChange={() => {}} />
                </td>
              </tr>
            )),
          )}
        </tbody>
      </table>
    )
  },
}
