import { useState } from 'react'
import RiwayatDrawer from './RiwayatDrawer'

export default {
  title: 'ui/RiwayatDrawer',
  component: RiwayatDrawer,
}

const SAMPLE_HISTORY = [
  { statusKey: 'menunggu', timestamp: '08:00', description: 'Pesanan diterima admin.' },
  { statusKey: 'dicuci', timestamp: '08:30', description: 'Sedang dalam proses pencucian.' },
  { statusKey: 'dikeringkan', timestamp: '10:15', description: 'Sedang dikeringkan.' },
  { statusKey: 'disetrika', timestamp: '11:00', description: 'Sedang disetrika.' },
  { statusKey: 'siap_diambil', timestamp: '12:30', description: 'Siap diambil pelanggan.' },
  { statusKey: 'selesai', timestamp: '13:45', description: 'Pesanan selesai.' },
]

export const Basic = {
  render: () => {
    function Wrapper() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg bg-primary px-4 py-2.5 text-label-md text-on-primary"
          >
            Buka Riwayat
          </button>
          <RiwayatDrawer open={open} onClose={() => setOpen(false)} orderCode="ORD-00123" history={SAMPLE_HISTORY} />
        </>
      )
    }
    return <Wrapper />
  },
}
