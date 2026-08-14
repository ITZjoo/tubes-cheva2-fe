import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../../../components/ui/Icon'
import Input from '../../../components/ui/Input'
import Typography from '../../../components/ui/Typography'
import Button from '../../../components/ui/Button'
import Sidebar from '../../../components/ui/Sidebar'
import ProfilePhotoCard from '../components/ProfilePhotoCard'
import PasswordFormCard from '../components/PasswordFormCard'
import { useAuth } from '../../../context/AuthContext'
import * as settingsService from '../services/settingsService'

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

export default function EditProfilAkunView() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [photoUrl, setPhotoUrl] = useState(null)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileError, setProfileError] = useState(null)
  const [profileSaved, setProfileSaved] = useState(false)

  // Prefill from the logged-in user once AuthContext's GET /me resolves.
  useEffect(() => {
    if (user) {
      setUsername(user.name ?? '')
      setPhone(user.phone ?? '')
    }
  }, [user])

  async function handleSaveProfile() {
    if (!user) return
    setProfileError(null)
    setProfileSaved(false)
    setSavingProfile(true)
    try {
      await settingsService.updateAccount(user.id, { name: username, phone })
      updateUser({ name: username, phone })
      setProfileSaved(true)
    } catch (err) {
      setProfileError(err.message || 'Gagal menyimpan profil')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleUpdatePassword({ newPassword }) {
    if (!user) return
    await settingsService.updateAccount(user.id, { password: newPassword })
  }

  function handlePhotoChange(file) {
    setPhotoUrl(URL.createObjectURL(file))
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
        <div className="mx-auto w-full max-w-[975px]">
          {/* Header: arrow + judul sejajar di satu baris */}
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center">
              <Icon name="arrow_back_ios" size={20} className="text-[#1C1B1F]" />
            </button>
            <Typography
              variant="h1"
              className="font-sans !w-[375px] !text-[32px] !font-bold !leading-10 !tracking-[-0.01em] text-black"
            >
              Edit Profil Akun
            </Typography>
          </div>

          <div className="mt-8 flex flex-wrap items-start gap-6">
            <div className="flex w-full max-w-[467px] flex-col gap-6">
              <div className="flex flex-col gap-4 rounded-2xl bg-on-primary p-[18px] shadow-[0px_1px_8px_0px_#00000026]">
                <Input
                  label="Username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    setProfileSaved(false)
                  }}
                  className="!h-9 !w-full !max-w-[411px] !gap-2.5 !rounded-lg !border !border-[#89D0ED] !bg-[#B9EAFF4D] !px-[15px] !py-[5px]"
                />
                <Input
                  label="No Telepon"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    setProfileSaved(false)
                  }}
                  className="!h-9 !w-full !max-w-[411px] !gap-2.5 !rounded-lg !border !border-[#89D0ED] !bg-[#B9EAFF4D] !px-[15px] !py-[5px]"
                />

                {profileError && <p className="text-body-sm font-semibold text-error">{profileError}</p>}
                {profileSaved && <p className="text-body-sm font-semibold text-success">Profil berhasil disimpan.</p>}

                <Button
                  variant="primary"
                  appearance="solid"
                  onClick={handleSaveProfile}
                  disabled={savingProfile || !user}
                  className="w-fit self-end !text-[12px]"
                >
                  {savingProfile ? 'Menyimpan...' : 'Simpan Profil'}
                </Button>
              </div>

              <PasswordFormCard onSubmit={handleUpdatePassword} onForgotPassword={() => navigate('/forgot-password')} />
            </div>

            <ProfilePhotoCard photoUrl={photoUrl} onPhotoChange={handlePhotoChange} />
          </div>
        </div>
      </div>
    </div>
  )
}