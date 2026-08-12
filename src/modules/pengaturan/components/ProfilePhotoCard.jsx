import { useRef } from 'react'
import Typography from '../../../components/ui/Typography'
import profilPlaceholder from '../../../assets/illustrations/profil.svg'

export default function ProfilePhotoCard({ photoUrl, onPhotoChange }) {
  const fileInputRef = useRef(null)

  function handlePick() {
    fileInputRef.current?.click()
  }

  function handleFileSelected(e) {
    const file = e.target.files?.[0]
    if (file) onPhotoChange?.(file)
  }

  return (
    <div className="flex w-full max-w-[484px] flex-col items-center gap-2.5 rounded-[18px] bg-on-primary px-8 py-5 shadow-[0px_1px_8px_0px_#0000001A]">
      <Typography variant="label-lg" className="!text-[16px] !font-semibold !leading-[140%] text-black">
        Foto Profil
      </Typography>

      <div className="flex h-[184px] w-[184px] items-center justify-center overflow-hidden rounded-full border border-black">
        <img
          src={photoUrl || profilPlaceholder}
          alt="Foto profil"
          className="h-full w-full object-cover"
        />
      </div>

      <button
        type="button"
        onClick={handlePick}
        className="text-center !text-[14px] !font-medium !leading-[200%] text-primary"
      >
        Ubah Foto Profil
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelected}
      />
    </div>
  )
}