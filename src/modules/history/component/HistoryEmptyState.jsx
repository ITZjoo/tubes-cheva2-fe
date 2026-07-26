import emptyHistoryIllustration from '../../../assets/illustrations/empty-history.png'

export default function HistoryEmptyState({
  title = 'Belum ada history...',
  description = 'Pastikan anda telah melakukan aktivitas ataupun perubahan sebelumnya',
  className = '',
}) {
  return (
    <div
      className={['flex h-full flex-col items-center justify-center gap-4 py-16 text-center', className]
        .filter(Boolean)
        .join(' ')}
    >
      <img src={emptyHistoryIllustration} alt="Belum ada history" className="h-auto w-64" />

      <div className="flex flex-col items-center gap-2">
        <h3
          className="font-sans font-bold text-primary"
          style={{ fontSize: 28, lineHeight: '28px', letterSpacing: '-0.56px' }}
        >
          {title}
        </h3>
        <p
          className="max-w-[494px] font-sans font-medium text-outline"
          style={{ fontSize: 24, lineHeight: '32px', letterSpacing: '-0.12px' }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}