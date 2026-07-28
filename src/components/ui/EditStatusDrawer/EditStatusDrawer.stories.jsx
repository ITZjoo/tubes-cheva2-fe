import { useState } from 'react'
import EditStatusDrawer from './EditStatusDrawer'
import { ORDER_STEPS } from '../Stepper'

export default {
  title: 'ui/EditStatusDrawer',
  component: EditStatusDrawer,
}

const SAMPLE_ORDER = {
  id: 'TRX/0023400501',
  customer: 'Albert',
  date: '22 Juni 2026 • 14:30',
  status: 'dicuci',
  services: [
    { name: 'Cuci Sekilo - 7.4 Kg', price: 37300 },
    { name: 'Selimut Kecil - 1 Pcs', price: 37300 },
  ],
  total: 74600,
  statusHistory: {
    menunggu: '22 Juni 2026 • 14:30',
    dicuci: '22 Juni 2026 • 11:30',
  },
}

export const Basic = {
  render: () => {
    function Wrapper() {
      const [open, setOpen] = useState(true)
      const [order, setOrder] = useState(SAMPLE_ORDER)

      const handleUpdateStatus = (statusKey) => {
        const stepIndex = ORDER_STEPS.findIndex((s) => s.key === statusKey)
        const nowLabel = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
        setOrder((prev) => {
          const history = { ...prev.statusHistory }
          if (statusKey === 'dibatalkan') {
            history.dibatalkan = nowLabel
          } else {
            ORDER_STEPS.forEach((step, idx) => {
              if (idx <= stepIndex && !history[step.key]) history[step.key] = nowLabel
            })
          }
          return { ...prev, status: statusKey, statusHistory: history }
        })
      }

      return (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg bg-primary px-4 py-2.5 text-label-md text-on-primary"
          >
            Buka Edit Status
          </button>
          <EditStatusDrawer
            open={open}
            onClose={() => setOpen(false)}
            order={order}
            onUpdateStatus={handleUpdateStatus}
          />
        </>
      )
    }
    return <Wrapper />
  },
}
