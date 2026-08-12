/**
 * PesanCepatCard — widget "Pesan Cepat" yang muncul di Dashboard & Pesanan.
 * Beda dari QuickChatModal: ini cuma preview SATU percakapan (bukan list),
 * dipakai buat mancing klik ke overlay penuh.
 *
 * Props:
 * - conversation: { name, role, lastMessage, time } | null — percakapan yang ditonjolkan
 *   (biasanya yang belum dibalas, fallback ke percakapan pertama)
 * - onLihatSemua: () => void — buka QuickChatModal dengan seluruh list
 * - onJawab: () => void — buka QuickChatModal langsung ke `conversation` ini
 */
export default function PesanCepatCard({ conversation, onLihatSemua, onJawab }) {
  return (
    <div className="w-full bg-surface-container-lowest rounded-[18px] p-6 shadow-[0px_1px_8px_0px_#0000001A] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-semibold leading-[1.4] font-body text-black">Pesan Cepat</h3>
        <button
          type="button"
          onClick={onLihatSemua}
          className="text-[14px] font-medium leading-[2] font-body text-primary cursor-pointer hover:underline"
        >
          Lihat semua
        </button>
      </div>

      {conversation ? (
        <>
          <div className="flex items-start gap-3">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
              alt={conversation.name}
              className="w-11 h-11 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-label-sm font-bold text-on-surface truncate">{conversation.name}</span>
                    <span className="text-[12px] font-normal leading-[1.2] font-body text-secondary">
                      {conversation.role ?? 'Pelanggan'}
                    </span>
                  </div>
                  <p className="text-[12px] font-normal leading-[1.8] font-body text-on-surface mt-1">
                    {conversation.lastMessage}
                  </p>
                </div>
                <span className="text-body-sm text-outline shrink-0">{conversation.time}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onJawab}
              className="rounded-lg bg-primary-container/30 text-[12px] font-normal leading-[1.8] font-body text-primary cursor-pointer hover:bg-primary-container/45 transition-colors"
              style={{ width: 66, height: 28, padding: '3px 15px' }}
            >
              Jawab
            </button>
          </div>
        </>
      ) : (
        <p className="text-body-sm text-on-surface-variant/70 text-center py-2">Belum ada pesan.</p>
      )}
    </div>
  )
}