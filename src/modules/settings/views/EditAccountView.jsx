import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../../../components/ui/PageShell'
import Icon from '../../../components/ui/Icon'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'
import { useAuth } from '../../../context/AuthContext'
import PasswordInput from '../components/PasswordInput'
import * as settingsService from '../services/settingsService'

export default function EditAccountView() {
  const handleSidebarNavigate = useSidebarNavigate()
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()

  // The design labels this field "Username" but the backend User model only
  // has `name` (no separate username column) — this maps to that field.
  const [profileForm, setProfileForm] = useState({ name: user?.name ?? '', phone: user?.phone ?? '' })
  const [profileErrors, setProfileErrors] = useState({})
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)

  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordErrors, setPasswordErrors] = useState({})
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const [avatarPreview, setAvatarPreview] = useState(null)

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setProfileSuccess(false)
    const errs = {}
    if (!profileForm.name.trim()) errs.name = 'Username wajib diisi'
    if (!profileForm.phone.trim()) errs.phone = 'No telepon wajib diisi'
    if (Object.keys(errs).length > 0) {
      setProfileErrors(errs)
      return
    }

    setProfileSaving(true)
    try {
      await settingsService.updateProfile(profileForm)
      updateUser(profileForm)
      setProfileErrors({})
      setProfileSuccess(true)
    } catch (err) {
      setProfileErrors({ name: err.message })
    } finally {
      setProfileSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordSuccess(false)
    const errs = {}
    if (!passwordForm.oldPassword) errs.oldPassword = 'Password lama wajib diisi'
    if (!passwordForm.newPassword) errs.newPassword = 'Password baru wajib diisi'
    if (passwordForm.newPassword && passwordForm.newPassword.length < 8) {
      errs.newPassword = 'Password baru minimal 8 karakter'
    }
    if (passwordForm.confirmPassword !== passwordForm.newPassword) {
      errs.confirmPassword = 'Konfirmasi password tidak cocok'
    }
    if (Object.keys(errs).length > 0) {
      setPasswordErrors(errs)
      return
    }

    setPasswordSaving(true)
    try {
      await settingsService.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
      setPasswordErrors({})
      setPasswordSuccess(true)
    } catch (err) {
      setPasswordErrors({ oldPassword: err.message })
    } finally {
      setPasswordSaving(false)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarPreview(URL.createObjectURL(file))
  }

  return (
    <PageShell
      activeItemId="pengaturan"
      onItemClick={handleSidebarNavigate}
      mainClassName="p-8 font-body max-w-[1100px] mx-auto flex flex-col gap-6"
    >
      <section className="flex items-center gap-3 border-b border-outline-variant/35 pb-4.5">
        <button
          onClick={() => navigate('/pengaturan')}
          className="w-10 h-10 rounded-xl hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer text-on-surface-variant"
        >
          <Icon name="arrow_back" size={22} className="text-on-surface" />
        </button>
        <h2 className="text-xl font-bold text-on-surface">Edit Profil Akun</h2>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <form
            onSubmit={handleSaveProfile}
            className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-4"
          >
            <Input
              variant="outlined"
              label="Username"
              placeholder="Masukkan username"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              error={profileErrors.name}
            />
            <Input
              variant="outlined"
              label="No Telepon"
              type="tel"
              placeholder="+62 812 3456 7890"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              error={profileErrors.phone}
            />

            <div className="flex items-center justify-end gap-3">
              {profileSuccess && <span className="text-body-sm text-success">Profil tersimpan</span>}
              <Button
                type="submit"
                variant="primary"
                appearance="solid"
                disabled={profileSaving}
                className="font-bold rounded-xl cursor-pointer bg-primary text-white hover:brightness-95 px-5 h-11"
              >
                {profileSaving ? 'Menyimpan...' : 'Simpan Profil'}
              </Button>
            </div>
          </form>

          <form
            onSubmit={handleChangePassword}
            className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-4"
          >
            <h3 className="text-subtitle text-on-surface">Ganti Password</h3>

            <PasswordInput
              label="Password Lama"
              value={passwordForm.oldPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              error={passwordErrors.oldPassword}
            />
            <PasswordInput
              label="Password Baru"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              error={passwordErrors.newPassword}
            />
            <PasswordInput
              label="Konfirmasi Password Baru"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              error={passwordErrors.confirmPassword}
            />

            <button type="button" className="self-start text-label-md font-bold text-primary hover:underline">
              Forgot Password?
            </button>

            <div className="flex items-center justify-end gap-3">
              {passwordSuccess && <span className="text-body-sm text-success">Password diperbarui</span>}
              <Button
                type="submit"
                variant="primary"
                appearance="solid"
                disabled={passwordSaving}
                className="font-bold rounded-xl cursor-pointer bg-primary text-white hover:brightness-95 px-5 h-11"
              >
                {passwordSaving ? 'Menyimpan...' : 'Rubah Password'}
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col items-center gap-4">
          <h3 className="text-subtitle text-on-surface">Foto Profil</h3>

          <div className="w-32 h-32 rounded-full overflow-hidden bg-primary-container/40 border border-primary-fixed-dim flex items-center justify-center">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Foto profil" className="w-full h-full object-cover" />
            ) : (
              <Icon name="person" size={64} className="text-primary" />
            )}
          </div>

          <label className="text-label-md font-bold text-primary hover:underline cursor-pointer">
            Ubah Foto Profil
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </label>
        </div>
      </div>
    </PageShell>
  )
}
