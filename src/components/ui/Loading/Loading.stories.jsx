import React, { useState, useEffect } from 'react'
import Loading, { LOADING_SIZES, LOADING_VARIANTS } from './Loading'

const SIZES = Object.keys(LOADING_SIZES)
const VARIANTS = Object.keys(LOADING_VARIANTS)

export default {
  title: 'UI/Loading',
  component: Loading,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: { type: 'select' }, options: SIZES },
    variant: { control: { type: 'select' }, options: VARIANTS },
    wavy: { control: 'boolean' },
    text: { control: 'text' },
    showValue: { control: 'boolean' },
  },
}

// 1. Showcase Utama (Semua 4 Jenis Interaktif sekaligus dalam satu halaman)
// Cerita pertama ini akan menjadi playground utama di Docs page, sehingga slider "value" mengontrol keempat jenis sekaligus secara real-time!
export const AllInteractiveTypes = {
  args: {
    value: 50,
    variant: 'primary',
    text: 'Memproses berkas...',
    showValue: true,
  },
  render: (args) => (
    <div className="flex flex-col gap-6 max-w-md p-6 bg-surface border border-outline-variant rounded-xl">
      <div>
        <h4 className="text-label-sm font-bold text-primary mb-2">Jenis 1: Thin Straight (Tipis Lurus)</h4>
        <Loading {...args} size="sm" wavy={false} />
      </div>
      <div>
        <h4 className="text-label-sm font-bold text-primary mb-2">Jenis 2: Thick Straight (Tebal Lurus)</h4>
        <Loading {...args} size="lg" wavy={false} />
      </div>
      <div>
        <h4 className="text-label-sm font-bold text-primary mb-2">Jenis 3: Thin Wavy (Tipis Gelombang)</h4>
        <Loading {...args} size="sm" wavy={true} />
      </div>
      <div>
        <h4 className="text-label-sm font-bold text-primary mb-2">Jenis 4: Thick Wavy (Tebal Gelombang)</h4>
        <Loading {...args} size="lg" wavy={true} />
      </div>
    </div>
  ),
}

// 2. Jenis 1: Thin Straight (Independen)
export const ThinStraight = {
  args: {
    value: 50,
    size: 'sm',
    wavy: false,
    text: 'Memuat data...',
    showValue: true,
  },
}

// 3. Jenis 2: Thick Straight (Independen)
export const ThickStraight = {
  args: {
    value: 50,
    size: 'lg',
    wavy: false,
    text: 'Memasang pembaruan...',
    showValue: true,
  },
}

// 4. Jenis 3: Thin Wavy (Independen)
export const ThinWavy = {
  args: {
    value: 50,
    size: 'sm',
    wavy: true,
    text: 'Mengunduh data...',
    showValue: true,
  },
}

// 5. Jenis 4: Thick Wavy (Independen)
export const ThickWavy = {
  args: {
    value: 50,
    size: 'lg',
    wavy: true,
    text: 'Memproses transaksi...',
    showValue: true,
  },
}

// 6. Mode Indeterminate (Animasi Terus-Menerus)
export const IndeterminatePlayground = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-md p-6 bg-surface border border-outline-variant rounded-xl">
      <div>
        <h4 className="text-label-md font-bold mb-2">Straight Indeterminate</h4>
        <Loading size="md" wavy={false} text="Menghubungkan..." />
      </div>
      <div>
        <h4 className="text-label-md font-bold mb-2">Wavy Indeterminate</h4>
        <Loading size="md" wavy={true} variant="secondary" text="Sinkronisasi..." />
      </div>
    </div>
  ),
}

// 7. Demo Animasi Mengalir Dinamis
const AnimatedProgressDemo = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 5))
    }, 300)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col gap-6 max-w-md p-6 bg-surface border border-outline-variant rounded-xl">
      <div>
        <h4 className="text-label-lg font-bold mb-2">Thin Wavy Progress Demo</h4>
        <Loading value={progress} size="sm" wavy showValue text="Mengunggah..." />
      </div>
      <div>
        <h4 className="text-label-lg font-bold mb-2">Thick Wavy Progress Demo</h4>
        <Loading value={progress} size="lg" wavy showValue text="Memproses transaksi..." variant="secondary" />
      </div>
    </div>
  )
}

export const InteractiveDemo = {
  render: () => <AnimatedProgressDemo />,
}
