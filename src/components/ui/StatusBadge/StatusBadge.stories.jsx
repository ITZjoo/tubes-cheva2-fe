import StatusBadge, { STATUS_TONES } from './StatusBadge'

export default {
  title: 'UI/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: Object.keys(STATUS_TONES),
    },
  },
}

export const Default = {
  args: { status: 'dicuci' },
}

export const CustomLabel = {
  args: { status: 'dibatalkan', label: 'Dibatalkan Admin' },
}

export const AllStatuses = {
  render: () => (
    <div className="flex flex-col items-start gap-2">
      {Object.keys(STATUS_TONES).map((status) => (
        <StatusBadge key={status} status={status} />
      ))}
    </div>
  ),
}
