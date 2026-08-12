import { useState } from 'react'
import Popover from '../Popover'
import Icon from '../Icon'
import Button from '../Button'
import TimeStepper from '../TimeStepper'

// "Setting Jam" row: a label plus a "⋯" trigger that opens a small card with
// hour/minute steppers and a Simpan button. Popover only mounts `children`
// while open, so TimeSettingPanel's local draft state is fresh every time
// it's reopened — nothing commits to `hour`/`minute` until Simpan is
// pressed, so closing by clicking outside just discards the draft.
export default function TimeSettingPopover({
  label = 'Setting Jam',
  hour = 8,
  minute = 30,
  onSave,
  className = '',
}) {
  return (
    <div className={['flex items-center justify-between gap-3', className].filter(Boolean).join(' ')}>
      <span className="text-label-lg text-on-surface-variant">{label}</span>

      <Popover
        align="end"
        trigger={({ toggle }) => (
          <button
            type="button"
            onClick={toggle}
            aria-label={`Ubah ${label}`}
            className="flex h-8 w-8 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container"
          >
            <Icon name="more_horiz" size={20} />
          </button>
        )}
      >
        {({ close }) => (
          <TimeSettingPanel
            hour={hour}
            minute={minute}
            onSave={(time) => {
              onSave?.(time)
              close()
            }}
          />
        )}
      </Popover>
    </div>
  )
}

function TimeSettingPanel({ hour, minute, onSave }) {
  const [hourValue, setHourValue] = useState(hour)
  const [minuteValue, setMinuteValue] = useState(minute)

  return (
    <div className="w-[252px] rounded-lg bg-surface-container-lowest p-5 shadow-lg">
      <div className="flex items-center justify-center gap-5">
        <TimeStepper value={hourValue} max={23} label="jam" onChange={setHourValue} />
        <span className="text-h2 text-primary">:</span>
        <TimeStepper value={minuteValue} max={59} label="menit" onChange={setMinuteValue} />
      </div>

      <div className="mt-5 flex justify-end">
        <Button
          variant="primary"
          appearance="solid"
          size="lg"
          className="rounded-lg"
          onClick={() => onSave?.({ hour: hourValue, minute: minuteValue })}
        >
          Simpan
        </Button>
      </div>
    </div>
  )
}
