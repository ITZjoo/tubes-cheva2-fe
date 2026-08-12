const DEFAULT_QUICK_REPLIES = [
  '15:30',
  'Pesanan Sudah Selesai',
  'Pesanan Sedang Dicuci',
  'Menunggu Pembayaran',
  'Pesanan Sedang Diantar',
  'Siap',
  'Pesanan Sudah Siap Diambil',
  'Pesanan Sedang Disetrika',
  'Pesanan Sedang Dikeringkan',
  'Maaf Ya...',
  'Ok',
]

/**
 * QuickReplyChips — grid tombol jawaban cepat (single-select) + tombol "Kirim Jawaban".
 *
 * Props:
 * - options?: string[]
 * - selected: string | null
 * - onSelect: (value: string) => void
 * - onSend: () => void
 * - disabled?: boolean — biasanya `!selected`
 */
export default function QuickReplyChips({
  options = DEFAULT_QUICK_REPLIES,
  selected,
  onSelect,
  onSend,
  disabled = false,
}) {
  return (
    <div className="flex flex-col gap-[18px]">
      <div className="flex flex-col gap-[10px]">
        <span className="text-body-sm font-medium text-on-surface">Balas Dengan Jawaban Cepat</span>
        <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Jawaban cepat">
          {options.map((reply) => (
            <button
              key={reply}
              type="button"
              role="radio"
              aria-checked={selected === reply}
              onClick={() => onSelect?.(reply)}
              className={[
                'rounded-lg px-[15px] py-[10px] text-body-sm font-semibold transition-colors cursor-pointer shadow-[0px_1px_8px_0px_#00000026]',
                selected === reply
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-white text-on-surface hover:bg-primary-container hover:text-on-primary-container',
              ].join(' ')}
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Dimensi & warna sesuai spek Figma persis (129x42, bg primary-container/30,
          padding 10px/25px) — nggak pakai shared <Button> karena style "container
          translucent" ini beda dari varian solid/outline yang ada di situ.
          TODO: on click spek Figma-nya juga buka overlay "Frame 334" (animasi
          slide-up 300ms) — belum diimplementasi karena isi frame itu belum
          dikirim, tinggal ganti onSend jadi trigger overlay itu begitu ada. */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onSend}
          disabled={disabled}
          style={{ width: 129, height: 42, padding: '10px 25px' }}
          className="shrink-0 rounded-lg text-body-sm font-semibold text-on-primary-container bg-primary-container/30 transition-colors cursor-pointer hover:bg-primary-container/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Kirim Jawaban
        </button>
      </div>
    </div>
  )
}