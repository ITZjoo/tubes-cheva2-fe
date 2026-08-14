import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../../../components/ui/Icon'
import Input from '../../../components/ui/Input'
import Typography from '../../../components/ui/Typography'
import Button from '../../../components/ui/Button'
import Sidebar from '../../../components/ui/Sidebar'
import Divider from '../../../components/ui/Divider'
import { getLaundryProfile, updateLaundryProfile } from '../services/settingsService'

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

const DAYS = [
  { key: 'minggu', label: 'Minggu' },
  { key: 'senin', label: 'Senin' },
  { key: 'selasa', label: 'Selasa' },
  { key: 'rabu', label: 'Rabu' },
  { key: 'kamis', label: 'Kamis' },
  { key: 'jumat', label: 'Jumat' },
  { key: 'sabtu', label: 'Sabtu' },
]

const FIELD_LABEL_CLASS = '!text-[14px] !font-semibold !leading-[200%] text-on-background'
const PLACEHOLDER_BOX_CLASS =
  '!w-full !rounded-lg !border !border-[#89D0ED] !bg-[#B9EAFF4D] !px-[15px] !py-[5px]'

function DayChip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'h-[42px] w-[70px] shrink-0 rounded-lg px-[15px] py-2.5 text-[14px] font-medium transition-colors',
        selected
          ? 'bg-[#B9EAFF4D] text-on-background shadow-[0px_1px_8px_0px_#00000026]'
          : 'border border-outline-variant bg-transparent text-outline',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

function TimeField({ label, value, onChange }) {
  const inputRef = useRef(null)

  function openPicker() {
    inputRef.current?.showPicker?.()
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col gap-2">
      <Typography variant="label-lg" className={FIELD_LABEL_CLASS}>
        {label}
      </Typography>
      <div className="flex h-[52px] w-[176px] items-center justify-between gap-3 rounded-2xl border border-outline-variant bg-on-primary px-4">
        <input
          ref={inputRef}
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-[64px] flex-1 bg-transparent text-[18px] font-medium text-on-surface outline-none [&::-webkit-calendar-picker-indicator]:hidden"
        />
        <Divider orientation="vertical" className="h-6" />
        <button type="button" onClick={openPicker} aria-label={`Pilih ${label}`}>
          <Icon name="schedule" size={24} className="text-on-surface-variant" />
        </button>
      </div>
    </div>
  )
}

export default function EditProfilLaundryView() {
  const navigate = useNavigate()

  const [namaLaundry, setNamaLaundry] = useState('')
  const [alamat, setAlamat] = useState('')
  const [informasi, setInformasi] = useState('')
  const [selectedDays, setSelectedDays] = useState(DAYS.map((d) => d.key))
  const [jamBuka, setJamBuka] = useState('08:00')
  const [jamTutup, setJamTutup] = useState('22:00')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [tautan, setTautan] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  const wordCount = informasi.trim().length === 0 ? 0 : informasi.trim().split(/\s+/).length

  useEffect(() => {
    getLaundryProfile()
      .then((p) => {
        if (!p) return
        setNamaLaundry(p.name ?? '')
        setAlamat(p.address ?? '')
        setInformasi(p.info ?? '')
        if (Array.isArray(p.operationalDays) && p.operationalDays.length > 0) {
          setSelectedDays(p.operationalDays)
        }
        setJamBuka(p.openTime ?? '08:00')
        setJamTutup(p.closeTime ?? '22:00')
        setWhatsapp(p.whatsapp ?? '')
        setEmail(p.email ?? '')
        setTautan(p.links ?? '')
      })
      .catch(() => {})
  }, [])

  function toggleDay(key) {
    setSelectedDays((prev) => (prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]))
  }

  async function handleSave() {
    try {
      setSaving(true)
      setMessage(null)
      await updateLaundryProfile({
        name: namaLaundry,
        address: alamat,
        info: informasi,
        operationalDays: selectedDays,
        openTime: jamBuka,
        closeTime: jamTutup,
        whatsapp,
        email,
        links: tautan,
      })
      setMessage('Profil laundry berhasil disimpan')
    } catch (error) {
      setMessage(error.message || 'Gagal menyimpan profil laundry')
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

  return (
    <div className="flex h-screen overflow-hidden bg-surface-container-low">
      <Sidebar activeItemId="pengaturan" onItemClick={handleSidebarItemClick} onLogout={handleLogout} />
      <div className="flex-1 overflow-y-auto p-8">
              {/* Header: arrow + judul sejajar di satu baris */}
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center">
                  <Icon name="arrow_back_ios" size={20} className="text-[#1C1B1F]" />
                </button>
                <Typography
                  variant="h1"
                  className="font-sans !w-[375px] !text-[32px] !font-bold !leading-10 !tracking-[-0.01em] text-black"
                >
                  Edit Profil Laundry
                </Typography>
              </div>

        <div className="mt-8 flex flex-wrap items-start gap-6">
          {/* Kolom kiri: Nama, Alamat, Informasi Laundry */}
          <div className="flex w-[432px] flex-col gap-[15px] rounded-2xl bg-on-primary p-[18px] shadow-[0px_1px_8px_0px_#00000026]">
            <div className="flex flex-col gap-1">
              <Typography variant="label-lg" className={FIELD_LABEL_CLASS}>
                Nama Laundry
              </Typography>
              <Input
                value={namaLaundry}
                onChange={(e) => setNamaLaundry(e.target.value)}
                className={`!h-9 ${PLACEHOLDER_BOX_CLASS}`}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Typography variant="label-lg" className={FIELD_LABEL_CLASS}>
                Alamat Laundry
              </Typography>
              <textarea
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                rows={2}
                className={`h-[54px] resize-none text-[14px] text-on-background outline-none ${PLACEHOLDER_BOX_CLASS}`}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Typography variant="label-lg" className={FIELD_LABEL_CLASS}>
                Informasi Laundry
              </Typography>
              <textarea
                value={informasi}
                onChange={(e) => setInformasi(e.target.value.slice(0, 250))}
                rows={10}
                placeholder="-"
                className={`h-[277px] resize-none text-[14px] text-on-background outline-none placeholder:text-on-surface-variant ${PLACEHOLDER_BOX_CLASS}`}
              />
              <span className="self-end text-[12px] font-normal leading-[180%] text-primary">
                {wordCount}/250 kata
              </span>
            </div>
          </div>

          {/* Kolom kanan: Jam Operasional + Kontak Laundry */}
          <div className="flex w-[553px] flex-col gap-[15px]">
            <div className="flex flex-col gap-[15px] rounded-2xl bg-on-primary p-[18px] shadow-[0px_1px_8px_0px_#00000026]">
              <Typography variant="label-lg" className={FIELD_LABEL_CLASS}>
                Jam Operasional
              </Typography>

              <div className="flex flex-col gap-2">
                <Typography variant="label-lg" className={FIELD_LABEL_CLASS}>
                  Hari Operasional
                </Typography>
                <div className="flex flex-wrap gap-1">
                  {DAYS.map((day) => (
                    <DayChip
                      key={day.key}
                      label={day.label}
                      selected={selectedDays.includes(day.key)}
                      onClick={() => toggleDay(day.key)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-6">
                <TimeField label="Jam Buka" value={jamBuka} onChange={setJamBuka} />
                <TimeField label="Jam Tutup" value={jamTutup} onChange={setJamTutup} />
              </div>
            </div>

            <div className="flex flex-col gap-[15px] rounded-2xl bg-on-primary p-[18px] shadow-[0px_1px_8px_0px_#00000026]">
              <Typography variant="label-lg" className={FIELD_LABEL_CLASS}>
                Kontak Laundry
              </Typography>

              <div className="flex flex-col gap-1">
                <Typography variant="label-lg" className={FIELD_LABEL_CLASS}>
                  No Whatsapp
                </Typography>
                <Input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className={`!h-9 !max-w-[497px] ${PLACEHOLDER_BOX_CLASS}`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Typography variant="label-lg" className={FIELD_LABEL_CLASS}>
                  Email
                </Typography>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`!h-9 !max-w-[497px] ${PLACEHOLDER_BOX_CLASS}`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Typography variant="label-lg" className={FIELD_LABEL_CLASS}>
                  Tautan Lainnya
                </Typography>
                <Input
                  value={tautan}
                  onChange={(e) => setTautan(e.target.value)}
                  placeholder="-"
                  className={`!h-9 !max-w-[497px] ${PLACEHOLDER_BOX_CLASS}`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex max-w-[1054px] flex-col items-end gap-2">
          {message && (
            <Typography
              variant="body-sm"
              className={message.startsWith('Profil laundry') ? 'text-primary' : 'text-error'}
            >
              {message}
            </Typography>
          )}
          <Button
            variant="primary"
            appearance="solid"
            onClick={handleSave}
            disabled={saving}
            className="!h-12 !rounded-lg !px-[25px] !py-2.5 !text-[14px]"
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </div>
    </div>
  )
}