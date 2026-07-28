import { useState } from 'react'
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

const SAMPLE_CUSTOMERS = [
  { id: 'c1', name: 'Budi Santoso', phone: '081234567890' },
  { id: 'c2', name: 'Siti Aminah', phone: '081298765432' },
  { id: 'c3', name: 'Andi Wijaya', phone: '081211112222' },
]

export const WithCustomerLookup = {
  render: () => {
    function Wrapper() {
      const [customers, setCustomers] = useState(SAMPLE_CUSTOMERS)
      const [lastSubmit, setLastSubmit] = useState(null)

      const handleAddCustomer = (customer) => {
        const created = { id: `new-${Date.now()}`, ...customer }
        setCustomers((prev) => [...prev, created])
        return created
      }

      return (
        <div className="flex w-[480px] flex-col items-end gap-3 p-10">
          <AddOrderPopover customers={customers} onAddCustomer={handleAddCustomer} onSubmit={setLastSubmit} />
          {lastSubmit && (
            <pre className="w-full whitespace-pre-wrap text-label-sm text-on-surface-variant">
              {JSON.stringify(lastSubmit.customer, null, 2)}
            </pre>
          )}
        </div>
      )
    }
    return <Wrapper />
  },
}
