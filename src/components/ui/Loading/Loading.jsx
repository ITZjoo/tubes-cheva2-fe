import React, { useId } from 'react'

export const LOADING_VARIANTS = {
  primary: {
    active: 'var(--color-primary, #0a6780)',
    track: 'var(--color-primary-container, #b9eaff)',
  },
  secondary: {
    active: 'var(--color-secondary, #006a61)',
    track: 'var(--color-secondary-container, #9ef2e5)',
  },
  tertiary: {
    active: 'var(--color-tertiary, #66558f)',
    track: 'var(--color-tertiary-container, #e9ddff)',
  },
  error: {
    active: 'var(--color-error, #904a42)',
    track: 'var(--color-error-container, #ffdad5)',
  },
}

export const LOADING_SIZES = {
  sm: { svgHeight: 28, midline: 14, amplitude: 6.5, strokeWidth: 4, pathLength: 1035, gap: 8 },
  md: { svgHeight: 32, midline: 16, amplitude: 8.5, strokeWidth: 6, pathLength: 1060, gap: 11 },
  lg: { svgHeight: 44, midline: 22, amplitude: 12.0, strokeWidth: 10, pathLength: 1120, gap: 16 },
}

function generateWavePath(width, cycleWidth, amplitude, midline) {
  let path = `M 0 ${midline}`
  const cycles = Math.ceil(width / cycleWidth)
  for (let i = 0; i < cycles; i++) {
    const startX = i * cycleWidth
    const cp1X = startX + cycleWidth / 4
    const cp2X = startX + (3 * cycleWidth) / 4
    const endX = startX + cycleWidth
    path += ` C ${cp1X} ${midline - amplitude}, ${cp2X} ${midline + amplitude}, ${endX} ${midline}`
  }
  return path
}

export default function Loading({
  value, // Nilai progres (0-100). Jika kosong (undefined), berjalan dalam mode indeterminate (berjalan terus).
  size = 'md', // sm (thin), md, lg (thick)
  variant = 'primary', // primary, secondary, tertiary, error
  wavy = false, // jika true, progres aktif akan bergelombang (seperti screenshot 3 & 4)
  text = '', // teks label pemuatan
  showValue = false, // jika true, menampilkan persentase nilai progres
  className = '',
  ...rest
}) {
  const isIndeterminate = value === undefined || value === null
  
  const sizeConfig = LOADING_SIZES[size] || LOADING_SIZES.md
  const colors = LOADING_VARIANTS[variant] || LOADING_VARIANTS.primary

  const { svgHeight, midline, amplitude, strokeWidth, pathLength, gap } = sizeConfig

  // Latar belakang (track) selalu lurus
  const trackPathD = `M 0 ${midline} L 1000 ${midline}`

  // Progres aktif bergelombang jika wavy=true, tapi lurus jika progres <= 10% atau >= 100%
  const shouldBeWavy = wavy && (isIndeterminate || (value > 10 && value < 100))
  
  // Lebar siklus gelombang (cycleWidth) diatur ke 96 agar lekukan gelombang terlihat besar
  const activePathD = shouldBeWavy
    ? generateWavePath(1000, 96, amplitude, midline)
    : `M 0 ${midline} L 1000 ${midline}`

  // Batasi nilai progres antara 0 dan 100
  const clampedValue = Math.min(Math.max(value || 0, 0), 100)
  const progressX = clampedValue * 10
  const totalLength = shouldBeWavy ? pathLength : 1000

  // Style untuk progres aktif menggunakan strokeDashoffset agar ujung kanan terpotong rounded (strokeLinecap) secara native
  const activeStyle = {
    strokeDasharray: `${totalLength} ${totalLength}`,
    strokeDashoffset: isIndeterminate ? undefined : totalLength - (clampedValue / 100) * totalLength,
    transition: isIndeterminate ? undefined : 'stroke-dashoffset 0.3s ease-out',
  }

  // Style untuk track latar belakang menggunakan strokeDashoffset negatif untuk membuat celah (gap) rounded secara dinamis
  const trackStyle = {
    strokeDasharray: '1000 1000',
    strokeDashoffset: isIndeterminate ? 0 : (clampedValue === 0 ? 0 : - Math.min(progressX + gap, 1000)),
    transition: isIndeterminate ? undefined : 'stroke-dashoffset 0.3s ease-out',
  }

  // Sesuai masukan: Tambahkan padding aman di sekeliling viewBox agar ujung lengkungan round (strokeLinecap) 
  // di posisi X=0 dan X=1000, serta tinggi gelombang di Y=0/Y=maks tidak terpotong (clipped) oleh batas SVG.
  const paddingX = strokeWidth
  const paddingY = strokeWidth / 2 + 4
  const viewBoxX = -paddingX
  const viewBoxY = -paddingY
  const viewBoxWidth = 1000 + paddingX * 2
  const viewBoxHeight = svgHeight + paddingY * 2

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`} {...rest}>
      {/* Header berisi label teks & persentase nilai */}
      {(text || (showValue && !isIndeterminate)) && (
        <div className="flex items-center justify-between">
          {text && (
            <span className="text-label-md text-on-surface font-semibold">
              {text}
            </span>
          )}
          {showValue && !isIndeterminate && (
            <span className="text-label-sm text-on-surface-variant font-mono font-medium">
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}

      {/* Progress SVG */}
      <svg
        width="100%"
        height={viewBoxHeight}
        viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        {/* Latar Belakang Track (Selalu Lurus, dengan strokeDashoffset dinamis untuk celah rounded) */}
        <path
          d={trackPathD}
          fill="none"
          stroke={colors.track}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity="0.8"
          style={trackStyle}
        />

        {/* Progres Aktif (Bisa Lurus atau Gelombang, dengan strokeDashoffset dinamis untuk ujung kanan rounded) */}
        <path
          d={activePathD}
          fill="none"
          stroke={colors.active}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={
            isIndeterminate
              ? {
                  strokeDasharray: '240 760',
                  animation: 'indeterminate-travel 1.8s infinite linear',
                }
              : activeStyle
          }
        />

        {/* Dot di ujung kanan paling akhir (sesuai spesifikasi desain M3) */}
        <circle
          cx="1000"
          cy={midline}
          r={strokeWidth / 2}
          fill={colors.active}
        />

        {/* Style block self-contained untuk animasi travel indeterminate */}
        {isIndeterminate && (
          <style>
            {`
              @keyframes indeterminate-travel {
                0% {
                  stroke-dashoffset: 1000;
                }
                100% {
                  stroke-dashoffset: 0;
                }
              }
            `}
          </style>
        )}
      </svg>
    </div>
  )
}
