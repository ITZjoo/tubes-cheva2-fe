import React, { useId } from 'react'

// Peta class utility Tailwind terpisah untuk Stroke dan Fill guna menghindari 
// kebocoran warna isi (fill) pada jalur garis path SVG.
const ACTIVE_STROKE_CLASSES = {
  primary: 'stroke-primary',
  secondary: 'stroke-secondary',
  tertiary: 'stroke-tertiary',
  error: 'stroke-error',
}

const ACTIVE_FILL_CLASSES = {
  primary: 'fill-primary',
  secondary: 'fill-secondary',
  tertiary: 'fill-tertiary',
  error: 'fill-error',
}

const TRACK_COLOR_CLASSES = {
  primary: 'stroke-primary-container',
  secondary: 'stroke-secondary-container',
  tertiary: 'stroke-tertiary-container',
  error: 'stroke-error-container',
}

export const LOADING_VARIANTS = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  error: 'error',
}

// Catatan: pathLength adalah estimasi panjang jalur gelombang (wavy path)
// yang dihasilkan oleh generateWavePath() menggunakan kalkulasi Bezier.
// Nilai ini harus diperbarui secara manual jika 'amplitude' atau 'cycleWidth' berubah.
export const LOADING_SIZES = {
  sm: { svgHeight: 32, midline: 16, amplitude: 7.0, strokeWidth: 4, pathLength: 1012, gap: 8 },
  md: { svgHeight: 36, midline: 18, amplitude: 9.0, strokeWidth: 6, pathLength: 1022, gap: 11 },
  lg: { svgHeight: 52, midline: 26, amplitude: 14.0, strokeWidth: 10, pathLength: 1045, gap: 16 },
}

// Sesuai screenshot: Gelombang dimulai ke arah BAWAH (valley) terlebih dahulu baru ke ATAS (crest).
// Oleh karena itu cp1 menggunakan (midline + amplitude) dan cp2 menggunakan (midline - amplitude).
function generateWavePath(width, cycleWidth, amplitude, midline) {
  let path = `M 0 ${midline}`
  const cycles = Math.ceil(width / cycleWidth)
  for (let i = 0; i < cycles; i++) {
    const startX = i * cycleWidth
    const cp1X = startX + cycleWidth / 4
    const cp2X = startX + (3 * cycleWidth) / 4
    const endX = startX + cycleWidth
    path += ` C ${cp1X} ${midline + amplitude}, ${cp2X} ${midline - amplitude}, ${endX} ${midline}`
  }
  return path
}

export default function Loading({
  value, // Nilai progres (0-100). Jika kosong (undefined), berjalan dalam mode indeterminate (berjalan terus).
  size = 'md', // sm (thin), md, lg (thick)
  variant = 'primary', // primary, secondary, tertiary, error
  wavy = false, // jika true, progres aktif akan bergelombang
  text = '', // teks label pemuatan
  showValue = false, // jika true, menampilkan persentase nilai progres
  className = '',
  ...rest
}) {
  const labelId = useId()
  const isIndeterminate = value === undefined || value === null
  
  const sizeConfig = LOADING_SIZES[size] || LOADING_SIZES.md
  const activeStrokeClass = ACTIVE_STROKE_CLASSES[variant] || ACTIVE_STROKE_CLASSES.primary
  const activeFillClass = ACTIVE_FILL_CLASSES[variant] || ACTIVE_FILL_CLASSES.primary
  const trackColorClass = TRACK_COLOR_CLASSES[variant] || TRACK_COLOR_CLASSES.primary

  const { svgHeight, midline, amplitude, strokeWidth, pathLength, gap } = sizeConfig

  // Latar belakang (track) selalu lurus
  const trackPathD = `M 0 ${midline} L 1000 ${midline}`

  // Progres aktif bergelombang jika wavy=true, tapi lurus jika progres <= 10% atau >= 100%
  const shouldBeWavy = wavy && (isIndeterminate || (value > 10 && value < 100))
  
  // Lebar siklus gelombang (cycleWidth) diatur ke 200 agar gelombang terlihat renggang (panjang gelombang lebar) sesuai screenshot
  const activePathD = shouldBeWavy
    ? generateWavePath(1000, 200, amplitude, midline)
    : `M 0 ${midline} L 1000 ${midline}`

  // Batasi nilai progres antara 0 dan 100
  const clampedValue = Math.min(Math.max(value || 0, 0), 100)
  const progressX = clampedValue * 10
  const totalLength = shouldBeWavy ? pathLength : 1000

  // Style untuk progres aktif menggunakan strokeDashoffset agar ujung kanan terpotong rounded secara native
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

  // Menambahkan padding aman di sekeliling viewBox agar ujung round dan tinggi gelombang tidak terpotong
  const paddingX = strokeWidth
  const paddingY = strokeWidth / 2 + 4
  const viewBoxX = -paddingX
  const viewBoxY = -paddingY
  const viewBoxWidth = 1000 + paddingX * 2
  const viewBoxHeight = svgHeight + paddingY * 2

  return (
    <div
      className={`w-full flex flex-col gap-2 ${className}`}
      role={isIndeterminate ? 'status' : 'progressbar'}
      aria-valuenow={isIndeterminate ? undefined : Math.round(clampedValue)}
      aria-valuemin={isIndeterminate ? undefined : 0}
      aria-valuemax={isIndeterminate ? undefined : 100}
      aria-label={isIndeterminate && !text ? 'loading' : undefined}
      aria-labelledby={text ? labelId : undefined}
      {...rest}
    >
      {/* Header berisi label teks & persentase nilai */}
      {(text || (showValue && !isIndeterminate)) && (
        <div className="flex items-center justify-between">
          {text && (
            <span id={labelId} className="text-label-md text-on-surface font-semibold animate-pulse">
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
        {/* Latar Belakang Track (Selalu Lurus) */}
        <path
          d={trackPathD}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity="0.8"
          className={trackColorClass}
          style={trackStyle}
        />

        {/* Progres Aktif (Bisa Lurus atau Gelombang, fill diset none eksplisit untuk mencegah coretan warna isi) */}
        <path
          d={activePathD}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={`${activeStrokeClass} ${isIndeterminate ? 'animate-indeterminate-travel' : ''}`}
          style={
            isIndeterminate
              ? {
                  strokeDasharray: '240 760',
                }
              : activeStyle
          }
        />

        {/* Dot di ujung kanan paling akhir */}
        <circle
          cx="1000"
          cy={midline}
          r={strokeWidth / 2}
          className={activeFillClass}
        />
      </svg>
    </div>
  )
}
