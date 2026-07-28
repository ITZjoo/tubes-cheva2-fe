import { useState } from 'react'
import Drawer from './Drawer'

export default {
  title: 'ui/Drawer',
  component: Drawer,
}

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
            Buka Drawer
          </button>
          <Drawer
            open={open}
            onClose={() => setOpen(false)}
            title="Judul Drawer"
            footer={
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full rounded-lg bg-primary py-2.5 text-label-md text-on-primary"
              >
                Simpan
              </button>
            }
          >
            <p className="text-body-md text-on-surface-variant">Isi drawer ditulis sebagai children.</p>
          </Drawer>
        </>
      )
    }
    return <Wrapper />
  },
}
