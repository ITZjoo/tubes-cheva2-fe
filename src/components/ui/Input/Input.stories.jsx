import { useState } from 'react'
import Input, { SearchIcon } from './Input'

export default {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['filled', 'outlined'] },
    floatingLabel: { control: 'boolean' },
  },
}

export const FilledDefault = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    helperText: 'Supporting text',
    variant: 'filled',
  },
}

export const FilledWithValue = {
  args: {
    label: 'Label',
    value: 'Input',
    helperText: 'Supporting text',
    variant: 'filled',
    showClear: true,
  },
}

export const FilledWithSearchIcon = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    helperText: 'Supporting text',
    variant: 'filled',
    startIcon: <SearchIcon />,
  },
}

export const OutlinedDefault = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    helperText: 'Supporting text',
    variant: 'outlined',
  },
}

export const OutlinedFloatingLabel = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    helperText: 'Supporting text',
    variant: 'outlined',
    floatingLabel: true,
  },
}

export const WithError = {
  args: {
    label: 'Label',
    value: 'Input',
    error: 'Supporting text',
    variant: 'filled',
  },
}

export const Disabled = {
  args: {
    label: 'Label',
    value: 'Input',
    helperText: 'Supporting text',
    variant: 'filled',
    disabled: true,
  },
}

export const Interactive = {
  render: () => {
    const [value, setValue] = useState('Input')

    return (
      <Input
        label="Label"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        helperText="Supporting text"
        variant="filled"
        startIcon={<SearchIcon />}
        showClear
        onClear={() => setValue('')}
      />
    )
  },
}

export const StateMatrix = {
  render: () => (
    <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
      <Input label="Label" placeholder="Placeholder" helperText="Supporting text" variant="filled" />
      <Input
        label="Label"
        placeholder="Placeholder"
        helperText="Supporting text"
        variant="filled"
        startIcon={<SearchIcon />}
      />
      <Input label="Label" value="Input" helperText="Supporting text" variant="outlined" />
      <Input
        label="Label"
        value="Input"
        error="Supporting text"
        variant="outlined"
        floatingLabel
      />
    </div>
  ),
}
