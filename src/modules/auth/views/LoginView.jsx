import { Link } from 'react-router-dom'
import Typography from '../../../components/ui/Typography'

export default function LoginView() {
  // TODO: call authService.login(form) once Input/Button are rebuilt

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-6">
      <div className="w-full max-w-sm space-y-2 text-center">
        <Typography.H1>Masuk</Typography.H1>
        <Typography.BodyMd className="text-on-surface-variant">
          Form login menunggu komponen Input dan Button di-develop ulang.
        </Typography.BodyMd>
        <Typography.BodyMd className="text-on-surface-variant">
          Belum punya akun?{' '}
          <Typography.Link as={Link} to="/register">
            Daftar
          </Typography.Link>
        </Typography.BodyMd>
      </div>
    </div>
  )
}
