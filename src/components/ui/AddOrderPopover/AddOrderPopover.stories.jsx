import AddOrderPopover from './AddOrderPopover'

export default {
  title: 'UI/AddOrderPopover',
  component: AddOrderPopover,
  tags: ['autodocs'],
}

export const Default = {
  render: () => (
    <div className="flex w-[480px] justify-end p-10">
      <AddOrderPopover onSubmit={(payload) => console.log('Tambah Pesanan submit:', payload)} />
    </div>
  ),
}
