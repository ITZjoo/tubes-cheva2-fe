import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Icon from '../../../components/ui/Icon'
import Typography from '../../../components/ui/Typography'
import Sidebar from '../../../components/ui/Sidebar'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import Toggle from '../../../components/ui/Toggle'
import Modal from '../../../components/ui/Modal'
import Divider from '../../../components/ui/Divider'
import { getPaymentSettings, updatePaymentSettings } from '../services/paymentSettingService'
import { uploadFile } from '../../../services/uploadService'
import { getAssetUrl } from '../../../services/api'

// TODO: sesuaikan kalau id menu Sidebar ternyata beda path-nya di AppRoutes
const SIDEBAR_ROUTES = {
  dashboard: '/dashboard',
  pesanan: '/orders',
  layanan: '/products',
  history: '/history',
  notifikasi: '/notifikasi',
  pendapatan: '/pendapatan',
  pengaturan: '/pengaturan',
}

const BANK_OPTIONS = [
  'Bank Mandiri',
  'Bank BCA',
  'Bank BRI',
  'Bank BNI',
  'Bank BSI',
  'Bank CIMB Niaga',
  'Bank Danamon',
  'Bank Permata',
]

// Label field ("Nama Merchant", "No. Rekening", dst): Urbanist 600 14px/200% on-background
const FIELD_LABEL_CLASS = 'font-body !text-[14px] !font-semibold !leading-[200%] text-on-background'
// Kotak input bergaya cyan (dipakai juga di EditProfilLaundryView)
const PLACEHOLDER_BOX_CLASS =
  '!w-full !rounded-lg !border !border-[#89D0ED] !bg-[#B9EAFF4D] !px-[15px] !py-[5px]'
// Judul section ("QRIS", "Rekening Bank/Transfer", "Tunai"): Plus Jakarta Sans 600 20px/28px on-background
const SECTION_TITLE_CLASS = 'font-sans !text-[20px] !font-semibold !leading-7 text-on-background'
// Deskripsi section: Urbanist 500 12px/180% #70787C
const SECTION_DESC_CLASS = 'font-body text-[12px] font-medium leading-[180%] text-[#70787C]'

let nextTempAccountId = -1

// Dropdown "Pilih Bank Rekening" — dibikin custom (bukan pakai Popover)
// supaya z-index-nya bisa dipastikan tampil di atas Modal (Modal ada di z-30).
function BankSelect({ label, value, onChange }) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex flex-col gap-1" ref={wrapperRef}>
      <Typography variant="label-lg" className={FIELD_LABEL_CLASS}>
        {label}
      </Typography>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`flex h-9 items-center justify-between text-left text-[14px] ${
            value ? 'text-on-background' : 'text-on-surface-variant'
          } ${PLACEHOLDER_BOX_CLASS}`}
        >
          <span className="truncate">{value || 'Pilih Bank Rekening'}</span>
          <Icon
            name="keyboard_arrow_down"
            size={20}
            className={`shrink-0 text-on-surface-variant transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-56 overflow-y-auto rounded-lg border border-outline-variant bg-surface-container-lowest shadow-lg custom-scrollbar">
            {BANK_OPTIONS.map((bank, index) => (
              <div key={bank}>
                {index > 0 && <Divider />}
                <button
                  type="button"
                  onClick={() => {
                    onChange(bank)
                    setOpen(false)
                  }}
                  className={`w-full px-4 py-3 text-left text-[14px] transition-colors hover:bg-surface-container ${
                    bank === value ? 'font-semibold text-primary' : 'text-on-background'
                  }`}
                >
                  {bank}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Modal untuk menambah/mengedit satu rekening bank.
function TambahRekeningModal({ open, onClose, onSave, initialValue }) {
  const [bankName, setBankName] = useState('')
  const [noRekening, setNoRekening] = useState('')
  const [namaPemilik, setNamaPemilik] = useState('')

  // Reset form setiap kali modal dibuka (bukan di render-time — dulu ini
  // penyebab field jadi kaya nge-reset sendiri / gak bisa diketik).
  useEffect(() => {
    if (open) {
      setBankName(initialValue?.bankName || '')
      setNoRekening(initialValue?.noRekening || '')
      setNamaPemilik(initialValue?.namaPemilik || '')
    }
  }, [open, initialValue])

  const isValid = bankName && noRekening.trim() && namaPemilik.trim()

  function handleSave() {
    if (!isValid) return
    onSave({ bankName, noRekening: noRekening.trim(), namaPemilik: namaPemilik.trim() })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Tambah Rekening Bank"
      footer={
        <Button
          variant="primary"
          appearance="solid"
          disabled={!isValid}
          onClick={handleSave}
          className="w-full !h-11 !rounded-lg !text-[14px]"
        >
          Simpan
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <BankSelect label="Pilih Bank Rekening" value={bankName} onChange={setBankName} />

        <div className="flex flex-col gap-1">
          <Typography variant="label-lg" className={FIELD_LABEL_CLASS}>
            No. Rekening
          </Typography>
          <Input
            value={noRekening}
            onChange={(e) => setNoRekening(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Nomor Rekening"
            className={`!h-9 ${PLACEHOLDER_BOX_CLASS}`}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Typography variant="label-lg" className={FIELD_LABEL_CLASS}>
            Nama Pemilik Rekening
          </Typography>
          <Input
            value={namaPemilik}
            onChange={(e) => setNamaPemilik(e.target.value)}
            placeholder="Nama Pemilik Rekening"
            className={`!h-9 ${PLACEHOLDER_BOX_CLASS}`}
          />
        </div>
      </div>
    </Modal>
  )
}

// Satu baris rekening bank yang sudah tersimpan.
// Layout: info di kiri, Toggle di kanan-atas, "Edit" (text link) + ikon
// hapus (bulat, bg error-container) di kanan-bawah — sesuai spek.
function BankAccountRow({ account, onToggle, onEdit, onDelete }) {
  return (
    <div className="flex min-h-[112px] w-full items-center justify-between rounded-lg bg-on-primary px-[18px] py-2.5 shadow-[0px_1px_8px_0px_#00000026]">
      <div className="flex flex-col gap-0.5">
        <Typography variant="label-lg" className="font-body !text-[16px] !font-semibold text-on-background">
          {account.bankName}
        </Typography>
        <Typography variant="body-sm" className="font-body !text-[13px] text-on-surface-variant">
          a/n {account.namaPemilik}
        </Typography>
        <Typography variant="body-sm" className="font-body !text-[13px] text-primary">
          No. Rek {account.noRekening}
        </Typography>
      </div>

      <div className="flex flex-col items-end gap-2">
        <Toggle checked={account.enabled} onChange={() => onToggle(account.id)} />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(account)}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-outline-variant bg-on-primary px-3 py-2 font-body text-[13px] font-medium text-primary"
          >
            <Icon name="edit" size={15} className="text-primary" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(account.id)}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-error-container px-3 py-2 font-body text-[13px] font-medium text-on-error-container"
          >
            <Icon name="delete" size={15} className="text-on-error-container" />
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PengaturanPembayaranView() {
  const navigate = useNavigate()
  const qrisInputRef = useRef(null)

  // QRIS
  const [qrisEnabled, setQrisEnabled] = useState(true)
  const [namaMerchant, setNamaMerchant] = useState('Utama Laundry')
  const [nmid, setNmid] = useState('')
  const [qrisImageUrl, setQrisImageUrl] = useState(null)

  // Rekening Bank/Transfer
  const [rekeningEnabled, setRekeningEnabled] = useState(true)
  const [accounts, setAccounts] = useState([])

  // Tunai
  const [tunaiEnabled, setTunaiEnabled] = useState(true)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState({ type: null, message: '' })

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getPaymentSettings()
        if (!settings) return
        setQrisEnabled(settings.qrisEnabled ?? true)
        setNamaMerchant(settings.qrisMerchantName ?? 'Utama Laundry')
        setNmid(settings.qrisNmid ?? '')
        setQrisImageUrl(settings.qrisImageUrl ?? null)
        setRekeningEnabled(settings.transferEnabled ?? true)
        setTunaiEnabled(settings.cashEnabled ?? true)
        setAccounts(settings.bankAccounts ?? [])
      } catch (err) {
        console.error('Gagal memuat pengaturan pembayaran', err)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  // Every toggle / account change / QRIS upload persists the whole document —
  // there's no separate "Simpan" button in this view by design, so each
  // action below calls this right after updating local state.
  async function persist(overrides = {}) {
    setSaving(true)
    setFeedback({ type: null, message: '' })
    try {
      const payload = {
        qrisEnabled,
        qrisMerchantName: namaMerchant,
        qrisNmid: nmid,
        qrisImageUrl,
        cashEnabled: tunaiEnabled,
        transferEnabled: rekeningEnabled,
        bankAccounts: accounts.map(({ bankName, noRekening, namaPemilik, enabled }) => ({
          bankName,
          noRekening,
          namaPemilik,
          enabled,
        })),
        ...overrides,
      }
      const updated = await updatePaymentSettings(payload)
      if (updated) {
        setQrisEnabled(updated.qrisEnabled ?? payload.qrisEnabled)
        setNamaMerchant(updated.qrisMerchantName ?? payload.qrisMerchantName)
        setNmid(updated.qrisNmid ?? payload.qrisNmid)
        setQrisImageUrl(updated.qrisImageUrl ?? payload.qrisImageUrl)
        setRekeningEnabled(updated.transferEnabled ?? payload.transferEnabled)
        setTunaiEnabled(updated.cashEnabled ?? payload.cashEnabled)
        setAccounts(updated.bankAccounts ?? payload.bankAccounts)
      }
      setFeedback({ type: 'success', message: 'Pengaturan pembayaran tersimpan' })
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Gagal menyimpan pengaturan pembayaran' })
    } finally {
      setSaving(false)
    }
  }

  function handleSidebarItemClick(item) {
    const path = SIDEBAR_ROUTES[item.id]
    if (path) navigate(path)
  }

  function handleLogout() {
    navigate('/login')
  }

  function handleUploadQrisClick() {
    qrisInputRef.current?.click()
  }

  async function handleQrisFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const url = await uploadFile(file)
      setQrisImageUrl(url)
      await persist({ qrisImageUrl: url })
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Gagal mengunggah QRIS' })
    }
  }

  async function handleRemoveQris() {
    setQrisImageUrl(null)
    if (qrisInputRef.current) qrisInputRef.current.value = ''
    await persist({ qrisImageUrl: null })
  }

  function openAddModal() {
    setEditingAccount(null)
    setIsModalOpen(true)
  }

  function openEditModal(account) {
    setEditingAccount(account)
    setIsModalOpen(true)
  }

  async function handleSaveAccount(values) {
    let nextAccounts
    if (editingAccount) {
      nextAccounts = accounts.map((acc) => (acc.id === editingAccount.id ? { ...acc, ...values } : acc))
    } else {
      nextAccounts = [...accounts, { id: nextTempAccountId--, enabled: true, ...values }]
    }
    setAccounts(nextAccounts)
    setIsModalOpen(false)
    await persist({
      bankAccounts: nextAccounts.map(({ bankName, noRekening, namaPemilik, enabled }) => ({
        bankName,
        noRekening,
        namaPemilik,
        enabled,
      })),
    })
  }

  async function handleDeleteAccount(id) {
    const nextAccounts = accounts.filter((acc) => acc.id !== id)
    setAccounts(nextAccounts)
    await persist({
      bankAccounts: nextAccounts.map(({ bankName, noRekening, namaPemilik, enabled }) => ({
        bankName,
        noRekening,
        namaPemilik,
        enabled,
      })),
    })
  }

  async function handleToggleAccount(id) {
    const nextAccounts = accounts.map((acc) => (acc.id === id ? { ...acc, enabled: !acc.enabled } : acc))
    setAccounts(nextAccounts)
    await persist({
      bankAccounts: nextAccounts.map(({ bankName, noRekening, namaPemilik, enabled }) => ({
        bankName,
        noRekening,
        namaPemilik,
        enabled,
      })),
    })
  }

  function handleQrisToggle(value) {
    setQrisEnabled(value)
    persist({ qrisEnabled: value })
  }

  function handleRekeningToggle(value) {
    setRekeningEnabled(value)
    persist({ transferEnabled: value })
  }

  function handleTunaiToggle(value) {
    setTunaiEnabled(value)
    persist({ cashEnabled: value })
  }

  function handleMerchantBlur() {
    persist({ qrisMerchantName: namaMerchant })
  }

  function handleNmidBlur() {
    persist({ qrisNmid: nmid })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface-container-low">
      <Sidebar activeItemId="pengaturan" onItemClick={handleSidebarItemClick} onLogout={handleLogout} />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto w-full max-w-[762px]">
          {/* Header: arrow + judul sejajar di satu baris */}
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center">
              <Icon name="arrow_back_ios" size={20} className="text-[#1C1B1F]" />
            </button>
            <Typography
              variant="h1"
              className="font-sans !w-[375px] !text-[32px] !font-bold !leading-10 !tracking-[-0.01em] text-black"
            >
              Pengaturan Pembayaran
            </Typography>
          </div>

          <div className="mt-[54px] flex w-full flex-col gap-6">
            {/* ===== QRIS ===== */}
            <div className="flex flex-col">
              <div className="flex h-[89px] items-center justify-between rounded-tl-lg rounded-tr-lg bg-on-primary px-6 py-6 shadow-[0px_1px_8px_0px_#00000026]">
                <div className="flex flex-col gap-1">
                  <Typography variant="label-lg" className={SECTION_TITLE_CLASS}>
                    QRIS
                  </Typography>
                  <Typography variant="body-sm" className={`!w-[333px] ${SECTION_DESC_CLASS}`}>
                    Unggah barcode QRIS toko Anda agar otomatis tampil di nota.
                  </Typography>
                </div>
                <Toggle checked={qrisEnabled} onChange={handleQrisToggle} />
              </div>

              {qrisEnabled && (
                <div className="flex flex-col gap-[15px] rounded-bl-2xl rounded-br-2xl bg-on-primary p-6 shadow-[0px_1px_8px_0px_#00000026]">
                  <div className="flex flex-wrap gap-6">
                    <div className="flex w-full max-w-[300px] flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <Typography variant="label-lg" className={FIELD_LABEL_CLASS}>
                          Nama Merchant
                        </Typography>
                        <Input
                          value={namaMerchant}
                          onChange={(e) => setNamaMerchant(e.target.value)}
                          onBlur={handleMerchantBlur}
                          className={`!h-9 ${PLACEHOLDER_BOX_CLASS}`}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <Typography variant="label-lg" className={FIELD_LABEL_CLASS}>
                          NMID
                        </Typography>
                        <Input
                          value={nmid}
                          onChange={(e) => setNmid(e.target.value)}
                          onBlur={handleNmidBlur}
                          className={`!h-9 ${PLACEHOLDER_BOX_CLASS}`}
                        />
                      </div>
                    </div>

                    <div className="flex w-[358px] shrink-0 flex-col gap-3">
                      <button
                        type="button"
                        onClick={handleUploadQrisClick}
                        className="flex h-[185px] w-full flex-col items-center justify-center gap-2.5 rounded-lg border border-dashed border-[#89D0ED] bg-[#B9EAFF4D] px-[15px] py-2.5 text-on-surface-variant transition-colors hover:bg-[#B9EAFF80]"
                      >
                        {qrisImageUrl ? (
                          <img
                            src={getAssetUrl(qrisImageUrl)}
                            alt="Preview QRIS"
                            className="h-full w-full rounded-lg object-contain"
                          />
                        ) : (
                          <>
                            <span className="font-body text-[13px]">Upload QRIS</span>
                          </>
                        )}
                      </button>

                      <div className="flex gap-3">
                        <Button
                          variant="primary"
                          appearance="solid"
                          onClick={handleUploadQrisClick}
                          className="!h-[42px] !flex-1 !whitespace-nowrap !rounded-lg !px-4 !py-2.5 font-body !text-[13px] !font-medium"
                        >
                          Upload QRIS
                        </Button>
                        <Button
                          variant="danger"
                          appearance="solid"
                          onClick={handleRemoveQris}
                          startIcon={<Icon name="delete" size={15} className="text-on-error-container" />}
                          className="!h-[42px] !flex-1 !whitespace-nowrap !rounded-lg !bg-error-container !px-4 !py-2.5 font-body !text-[13px] !font-medium !text-on-error-container hover:!brightness-100"
                        >
                          Hapus QRIS
                        </Button>
                      </div>
                      <input
                        ref={qrisInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleQrisFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ===== Rekening Bank/Transfer ===== */}
            <div className="flex flex-col">
              <div className="flex h-[89px] items-center justify-between rounded-tl-lg rounded-tr-lg bg-on-primary px-6 py-6 shadow-[0px_1px_8px_0px_#00000026]">
                <div className="flex flex-col gap-1">
                  <Typography variant="label-lg" className={SECTION_TITLE_CLASS}>
                    Rekening Bank/Transfer
                  </Typography>
                  <Typography variant="body-sm" className={SECTION_DESC_CLASS}>
                    Rekening Bank yang akan ditampilkan pada nota.
                  </Typography>
                </div>
                <Toggle checked={rekeningEnabled} onChange={handleRekeningToggle} />
              </div>

              {rekeningEnabled && (
                <div className="flex flex-col gap-[15px] rounded-bl-2xl rounded-br-2xl bg-on-primary p-6 shadow-[0px_1px_8px_0px_#00000026]">
                  {accounts.map((account) => (
                    <BankAccountRow
                      key={account.id}
                      account={account}
                      onToggle={handleToggleAccount}
                      onEdit={openEditModal}
                      onDelete={handleDeleteAccount}
                    />
                  ))}

                  <Button
                    variant="primary"
                    appearance="solid"
                    onClick={openAddModal}
                    startIcon={<Icon name="add" size={18} />}
                    className="!h-10 !w-full !rounded-lg font-body !text-[13px]"
                  >
                    Tambahkan Rekening Bank Baru
                  </Button>
                </div>
              )}
            </div>

            {/* ===== Tunai ===== */}
            <div className="flex h-[89px] items-center justify-between rounded-2xl bg-on-primary px-6 py-6 shadow-[0px_1px_8px_0px_#00000026]">
              <Typography variant="label-lg" className={SECTION_TITLE_CLASS}>
                Tunai
              </Typography>
              <Toggle checked={tunaiEnabled} onChange={handleTunaiToggle} />
            </div>

            {feedback.message && (
              <Typography
                variant="body-sm"
                className={`!text-[12px] ${feedback.type === 'error' ? 'text-error' : 'text-primary'}`}
              >
                {saving ? 'Menyimpan...' : feedback.message}
              </Typography>
            )}
          </div>
        </div>
      </div>

      <TambahRekeningModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAccount}
        initialValue={editingAccount}
      />
    </div>
  )
}