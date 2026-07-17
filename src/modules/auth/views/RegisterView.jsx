import { Link } from 'react-router-dom'
import Typography from '../../../components/ui/Typography'

export default function RegisterView() {
  // TODO: call authService.register(form) once Input/Button are rebuilt

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-6">
      <div className="w-full max-w-sm space-y-2 text-center">
        <Typography.H1>Daftar</Typography.H1>
        <Typography.BodyMd className="text-on-surface-variant">
          Form registrasi menunggu komponen Input dan Button di-develop ulang.
        </Typography.BodyMd>
        <Typography.BodyMd className="text-on-surface-variant">
          Sudah punya akun?{' '}
          <Typography.Link as={Link} to="/login">
            Masuk
          </Typography.Link>
        </Typography.BodyMd>
      </div>
    </div>
  )
}
