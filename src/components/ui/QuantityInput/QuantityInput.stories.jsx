import { useState } from 'react'
import QuantityInput from './QuantityInput'

export default {
  title: 'UI/QuantityInput',
  component: QuantityInput,
  tags: ['autodocs'],
}

export const Default = {
  args: { value: 0 },
}

export const WithMax = {
  args: { value: 3, max: 5 },
}

// "Tambah Order" — the list-of-rows use case from the design spec.
function OrderListDemo() {
  const [rows, setRows] = useState([
    { id: 1, name: 'Cuci Setrika Reguler', qty: 0 },
    { id: 2, name: 'Cuci Kering', qty: 2 },
    { id: 3, name: 'Setrika Saja', qty: 0 },
    { id: 4, name: 'Dry Cleaning', qty: 1 },
  ])

  const setQty = (id, qty) => setRows((prev) => prev.map((row) => (row.id === id ? { ...row, qty } : row)))

  return (
    <div className="flex w-72 flex-col gap-2">
      {rows.map((row) => (
        <div key={row.id} className="flex items-center justify-between">
          <span className="text-body-md text-on-surface">{row.name}</span>
          <QuantityInput value={row.qty} onChange={(qty) => setQty(row.id, qty)} />
        </div>
      ))}
    </div>
  )
}

export const TambahOrder = {
  render: () => <OrderListDemo />,
}
