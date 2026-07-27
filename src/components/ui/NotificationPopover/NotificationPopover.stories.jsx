import NotificationPopover from './NotificationPopover'

export default {
  title: 'UI/NotificationPopover',
  component: NotificationPopover,
  tags: ['autodocs'],
}

export const Default = {
  render: () => (
    <div className="flex w-[480px] justify-end p-10">
      <NotificationPopover />
    </div>
  ),
}

export const NoUnread = {
  render: () => (
    <div className="flex w-[480px] justify-end p-10">
      <NotificationPopover hasUnread={false} />
    </div>
  ),
}
