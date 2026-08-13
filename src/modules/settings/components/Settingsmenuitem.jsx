import Icon from '../../../components/ui/Icon'
import Typography from '../../../components/ui/Typography'

/**
 * Single row on the Pengaturan (settings) landing page.
 * icon: Material Symbols name (string)
 * label: menu title, e.g. "Edit Profil Akun"
 * onClick: navigate to the sub-page
 */
export default function SettingsMenuItem({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-lg bg-surface p-6 text-left shadow-[0px_1px_8px_0px_#00000026] transition-colors hover:bg-surface-container-lowest"
    >
      <span className="flex items-center gap-3">
        <Icon name={icon} size={20} className="text-primary" />
        <Typography variant="h3" as="span" className="!text-[20px] !font-semibold !leading-7 text-on-background">
          {label}
        </Typography>
      </span>
      <Icon name="arrow_back_ios" className="rotate-180 text-[#1C1B1F]" size={20} />
    </button>
  )
}