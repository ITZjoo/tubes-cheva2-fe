import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import logoOnly from '../../../assets/illustrations/Logo On Boarding.svg'
import logoWithSlogan from '../../../assets/illustrations/Logo On Boarding (1).svg'

export default function OnboardingView() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  // Transisi otomatis dari step 1 (logo saja) ke step 2 (logo + slogan) setelah 1.8 detik
  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => {
        setStep(2)
      }, 1800)
      return () => clearTimeout(timer)
    }
  }, [step])

  const handleStart = () => {
    localStorage.setItem('laundry_onboarded', 'true')
    navigate('/login')
  }

  return (
    <div 
      onClick={handleStart}
      className="relative flex min-h-screen flex-col items-center justify-center bg-[#f5fafc] p-6 overflow-hidden cursor-pointer select-none"
    >
      {/* Gaya animasi kustom untuk transisi fade-in yang halus */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes pulseSoft {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(0.98); }
        }
        .animate-pulse-soft {
          animation: pulseSoft 2s infinite ease-in-out;
        }
      `}</style>

      <div className="flex w-full max-w-md flex-col items-center justify-center z-10">
        {step === 1 ? (
          <div className="animate-fade-in animate-pulse-soft flex flex-col items-center justify-center text-center">
            <img
              src={logoOnly}
              alt="Utama Laundry Logo"
              className="h-36 w-auto object-contain"
            />
          </div>
        ) : (
          <div className="animate-fade-in flex flex-col items-center justify-center text-center">
            <img
              src={logoWithSlogan}
              alt="Utama Laundry"
              className="h-48 w-auto object-contain"
            />
          </div>
        )}
      </div>

      {/* Ornamen latar belakang soft */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 rounded-full bg-[#e3e9ea] opacity-40 blur-2xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-[#b9eaff] opacity-30 blur-3xl" />
    </div>
  )
}
