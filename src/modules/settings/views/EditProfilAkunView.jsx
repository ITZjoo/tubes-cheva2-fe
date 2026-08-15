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
import { updateProfile, changePassword } from '../services/settingsService'
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

export default function EditProfilAkunView() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [photoUrl, setPhotoUrl] = useState(null)
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    if (user) {
      setUsername(user.name || '')
      setPhone(user.phone || '')
      setPhotoUrl(getAssetUrl(user.photoUrl))
    }
  }, [user])

  async function handleSaveProfile() {
    setProfileError('')
    setProfileSuccess('')
    setSavingProfile(true)
    try {
      const updated = await updateProfile({ name: username, phone })
      updateUser(updated || { name: username, phone })
      setProfileSuccess('Profil berhasil disimpan')
    } catch (err) {
      setProfileError(err.message || 'Gagal menyimpan profil')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleUpdatePassword({ oldPassword, newPassword }) {
    await changePassword({ oldPassword, newPassword })
  }

  async function handlePhotoChange(file) {
    const previousUrl = photoUrl
    setPhotoUrl(URL.createObjectURL(file)) // instant preview while it uploads
    try {
      const uploadedUrl = await uploadFile(file)
      const updated = await updateProfile({ photoUrl: uploadedUrl })
      updateUser(updated || { photoUrl: uploadedUrl })
      setPhotoUrl(getAssetUrl(uploadedUrl))
    } catch (err) {
      setPhotoUrl(previousUrl)
      setProfileError(err.message || 'Gagal mengunggah foto profil')
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
                  onChange={(e) => setUsername(e.target.value)}
                  className="!h-9 !w-full !max-w-[411px] !gap-2.5 !rounded-lg !border !border-[#89D0ED] !bg-[#B9EAFF4D] !px-[15px] !py-[5px]"
                />
                <Input
                  label="No Telepon"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="!h-9 !w-full !max-w-[411px] !gap-2.5 !rounded-lg !border !border-[#89D0ED] !bg-[#B9EAFF4D] !px-[15px] !py-[5px]"
                />
                {profileError && (
                  <Typography variant="body-sm" className="!text-[12px] text-error">
                    {profileError}
                  </Typography>
                )}
                {profileSuccess && (
                  <Typography variant="body-sm" className="!text-[12px] text-primary">
                    {profileSuccess}
                  </Typography>
                )}

                <Button
                  variant="primary"
                  appearance="solid"
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
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