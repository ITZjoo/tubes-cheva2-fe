import { useNavigate } from 'react-router-dom'
import Icon from '../../../components/ui/Icon'

// One row = one card (not a divided list) — matches the Figma export:
// each row is independently shadowed/rounded with a gap between rows,
// not a single card with internal dividers.
export default function SettingsRow({ icon, label, to }) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="w-full flex items-center justify-between gap-4 bg-white border border-outline-variant/30 rounded-2xl shadow-sm px-6 py-7 text-left hover:shadow-md hover:bg-surface-container transition-all cursor-pointer"
    >
      <span className="flex items-center gap-4">
        <Icon name={icon} size={24} className="text-primary" />
        <span className="text-subtitle text-on-surface">{label}</span>
      </span>
      <Icon name="chevron_right" size={20} className="text-on-surface-variant" />
    </button>
  )
}
