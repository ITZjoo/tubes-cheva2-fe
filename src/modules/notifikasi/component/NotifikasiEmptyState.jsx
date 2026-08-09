import Typography from '../../../components/ui/Typography'
import emptyIllustration from '../../../assets/illustrations/empty-history.png'

export default function NotifikasiEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <img src={emptyIllustration} alt="" className="w-40 h-40 object-contain" />
      <Typography variant="subtitle" className="text-primary">
        Belum ada notifikasi...
      </Typography>
      <Typography variant="body-md" className="text-on-surface-variant">
        Tidak terdapat notifikasi baru, silahkan cek kembali nanti.
      </Typography>
    </div>
  )
}