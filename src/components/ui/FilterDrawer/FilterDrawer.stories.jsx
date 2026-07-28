import { useState } from 'react'
import FilterDrawer from './FilterDrawer'

export default {
  title: 'ui/FilterDrawer',
  component: FilterDrawer,
}

export const Basic = {
  render: () => {
    function Wrapper() {
      const [open, setOpen] = useState(true)
      const [lastApplied, setLastApplied] = useState(null)

      return (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg bg-primary px-4 py-2.5 text-label-md text-on-primary"
          >
            Buka Filter
          </button>
          {lastApplied && (
            <pre className="mt-3 max-w-[400px] whitespace-pre-wrap text-label-sm text-on-surface-variant">
              {JSON.stringify(lastApplied, null, 2)}
            </pre>
          )}
          <FilterDrawer open={open} onClose={() => setOpen(false)} onApply={setLastApplied} />
        </>
      )
    }
    return <Wrapper />
  },
}
