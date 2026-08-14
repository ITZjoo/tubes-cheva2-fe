import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../../../components/ui/Icon'
import Input from '../../../components/ui/Input'
import Typography from '../../../components/ui/Typography'
import Button from '../../../components/ui/Button'
import Sidebar from '../../../components/ui/Sidebar'
import ProfilePhotoCard from '../components/ProfilePhotoCard'
import PasswordFormCard from '../components/PasswordFormCard'
import { updateProfile, changePassword, uploadFile } from '../services/settingsService'
import { getProfile } from '../../auth/services/authService'
import { useAuth } from '../../../context/AuthContext'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''
const SERVER_ORIGIN = API_BASE.replace(/\/api\/?$/, '')
const resolveUploadUrl = (url) => (url && !url.startsWith('http') ? `${SERVER_ORIGIN}${url}` : url)

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
  const { updateUser } = useAuth()
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [photoUrl, setPhotoUrl] = useState(null)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [profileMessage, setProfileMessage] = useState(null)
  const [passwordMessage, setPasswordMessage] = useState(null)

  useEffect(() => {
    getProfile()
      .then((user) => {
        setUsername(user.name ?? '')
        setPhone(user.phone ?? '')
        setPhotoUrl(resolveUploadUrl(user.photoUrl))
      })
      .catch(() => {})
  }, [])

  async function handleSaveProfile() {
    try {
      setSavingProfile(true)
      setProfileMessage(null)
      await updateProfile({ name: username, phone })
      setProfileMessage('Profil berhasil disimpan')
    } catch (error) {
      setProfileMessage(error.message || 'Gagal menyimpan profil')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleUpdatePassword(values) {
    if (values.newPassword !== values.confirmPassword) {
      setPasswordMessage('Konfirmasi password tidak cocok')
      return
    }
    try {
      setSavingPassword(true)
      setPasswordMessage(null)
      await changePassword({ oldPassword: values.oldPassword, newPassword: values.newPassword })
      setPasswordMessage('Password berhasil diubah')
    } catch (error) {
      setPasswordMessage(error.message || 'Gagal mengubah password')
    } finally {
      setSavingPassword(false)
    }
  }

  async function handlePhotoChange(file) {
    try {
      setProfileMessage(null)
      const { url } = await uploadFile(file)
      await updateProfile({ photoUrl: url })
      updateUser({ photoUrl: url })
      setPhotoUrl(resolveUploadUrl(url))
      setProfileMessage('Foto profil berhasil disimpan')
    } catch (error) {
      setProfileMessage(error.message || 'Gagal mengunggah foto')
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
              {profileMessage && (
                <Typography
                  variant="body-sm"
                  className={profileMessage.startsWith('Profil') ? 'text-primary' : 'text-error'}
                >
                  {profileMessage}
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

            {passwordMessage && (
              <Typography
                variant="body-sm"
                className={passwordMessage.startsWith('Password') ? 'text-primary' : 'text-error'}
              >
                {passwordMessage}
              </Typography>
            )}
            <PasswordFormCard onSubmit={handleUpdatePassword} onForgotPassword={() => navigate('/forgot-password')} />
            {savingPassword && (
              <Typography variant="body-sm" className="text-on-surface-variant">
                Mengubah password...
              </Typography>
            )}
          </div>

          <ProfilePhotoCard photoUrl={photoUrl} onPhotoChange={handlePhotoChange} />
        </div>
      </div>
    </div>
  )
}
