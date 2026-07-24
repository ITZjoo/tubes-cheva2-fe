import FilterPopover from './FilterPopover'

export default {
  title: 'UI/FilterPopover',
  component: FilterPopover,
  tags: ['autodocs'],
}

export const Default = {
  render: () => (
    <div className="flex w-[480px] justify-end p-10">
      <FilterPopover onApply={(payload) => console.log('Filter applied:', payload)} />
    </div>
  ),
}
