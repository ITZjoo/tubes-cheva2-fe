import emptyIllustration from '../../../assets/illustrations/empty-history.svg'

export default function NotifikasiEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="w-[250px] h-[250px] p-[10px]">
        <img src={emptyIllustration} alt="" className="w-full h-full object-contain" />
      </div>
      <h3 className="font-sans font-bold text-[28px] leading-none tracking-[-0.02em] text-center text-primary">
        Belum ada notifikasi...
      </h3>
      <p className="font-sans font-medium text-[24px] leading-[32px] tracking-[-0.005em] text-center text-outline">
        Tidak terdapat notifikasi baru, silahkan cek kembali nanti.
      </p>
    </div>
  )
}